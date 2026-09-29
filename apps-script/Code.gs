const TIME_ZONE = 'Asia/Ho_Chi_Minh';
const DEFAULT_SHEET_NAME = 'Requests';
const CACHE_SECONDS = 120;

const HEADERS = [
  'requestId',
  'createdAt',
  'fullName',
  'email',
  'phone',
  'service',
  'subject',
  'description',
  'deadline',
  'budget',
  'preferredContact',
  'attachmentUrl',
  'status',
  'source',
  'userAgent',
  'note',
];

const FIELD_LIMITS = {
  requestToken: 100,
  fullName: 100,
  email: 150,
  phone: 30,
  service: 120,
  subject: 150,
  description: 3000,
  deadline: 20,
  budget: 100,
  preferredContact: 40,
  attachmentUrl: 500,
  source: 80,
  userAgent: 300,
  website: 200,
};

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({
      ok: true,
      service: 'Luuiw request receiver',
      time: Utilities.formatDate(new Date(), TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ssXXX"),
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const parameters = e && e.parameter ? e.parameter : {};
  const requestToken = limitString_(parameters.requestToken, FIELD_LIMITS.requestToken);

  try {
    if (!requestToken || !/^[a-zA-Z0-9-]+$/.test(requestToken)) {
      return htmlResponse_({
        type: 'luuiw-form-response',
        requestToken: '',
        ok: false,
        message: 'Yêu cầu không hợp lệ. Vui lòng tải lại trang và thử lại.',
      });
    }

    if (limitString_(parameters.website, FIELD_LIMITS.website)) {
      return htmlResponse_({
        type: 'luuiw-form-response',
        requestToken: requestToken,
        ok: false,
        message: 'Yêu cầu không thể được xử lý.',
      });
    }

    const config = getConfig_();
    const data = parseAndValidate_(parameters);
    const fingerprint = createFingerprint_(data);
    const cache = CacheService.getScriptCache();

    if (cache.get(fingerprint)) {
      return htmlResponse_({
        type: 'luuiw-form-response',
        requestToken: requestToken,
        ok: false,
        message: 'Một yêu cầu tương tự vừa được gửi. Vui lòng chờ ít phút trước khi thử lại.',
      });
    }

    const lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) {
      throw new Error('LOCK_TIMEOUT');
    }

    let requestId;
    let createdAt;
    try {
      const sheet = getRequestSheet_(config);
      requestId = createUniqueRequestId_(sheet);
      createdAt = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm:ss');

      sheet.appendRow([
        requestId,
        createdAt,
        sheetSafe_(data.fullName),
        sheetSafe_(data.email),
        sheetSafe_(data.phone),
        sheetSafe_(data.service),
        sheetSafe_(data.subject),
        sheetSafe_(data.description),
        sheetSafe_(data.deadline),
        sheetSafe_(data.budget),
        sheetSafe_(data.preferredContact),
        sheetSafe_(data.attachmentUrl),
        'Chờ tiếp nhận',
        sheetSafe_(data.source),
        sheetSafe_(data.userAgent),
        '',
      ]);
      cache.put(fingerprint, requestId, CACHE_SECONDS);
    } finally {
      lock.releaseLock();
    }

    sendNotificationsSafely_(config.notificationEmail, requestId, createdAt, data);

    return htmlResponse_({
      type: 'luuiw-form-response',
      requestToken: requestToken,
      ok: true,
      requestId: requestId,
    });
  } catch (error) {
    const errorName = error && error.name ? error.name : 'Error';
    const errorCode = error && error.message ? error.message : 'UNKNOWN';
    console.error('Luuiw doPost failed: %s / %s', errorName, errorCode);

    return htmlResponse_({
      type: 'luuiw-form-response',
      requestToken: requestToken,
      ok: false,
      message: publicErrorMessage_(errorCode),
    });
  }
}

function getConfig_() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = String(properties.getProperty('SPREADSHEET_ID') || '').trim();
  const notificationEmail = String(properties.getProperty('NOTIFICATION_EMAIL') || '').trim();
  const sheetName = String(properties.getProperty('SHEET_NAME') || DEFAULT_SHEET_NAME).trim();

  if (!spreadsheetId || !notificationEmail) {
    throw new Error('CONFIG_MISSING');
  }
  if (!isValidEmail_(notificationEmail)) {
    throw new Error('CONFIG_EMAIL_INVALID');
  }
  return { spreadsheetId: spreadsheetId, notificationEmail: notificationEmail, sheetName: sheetName };
}

function parseAndValidate_(parameters) {
  const data = {
    fullName: limitString_(parameters.fullName, FIELD_LIMITS.fullName),
    email: limitString_(parameters.email, FIELD_LIMITS.email).toLowerCase(),
    phone: limitString_(parameters.phone, FIELD_LIMITS.phone),
    service: limitString_(parameters.service, FIELD_LIMITS.service),
    subject: limitString_(parameters.subject, FIELD_LIMITS.subject),
    description: limitString_(parameters.description, FIELD_LIMITS.description),
    deadline: limitString_(parameters.deadline, FIELD_LIMITS.deadline),
    budget: limitString_(parameters.budget, FIELD_LIMITS.budget),
    preferredContact: limitString_(parameters.preferredContact, FIELD_LIMITS.preferredContact),
    attachmentUrl: limitString_(parameters.attachmentUrl, FIELD_LIMITS.attachmentUrl),
    source: limitString_(parameters.source, FIELD_LIMITS.source) || 'luuiw-website',
    userAgent: limitString_(parameters.userAgent, FIELD_LIMITS.userAgent),
  };

  if (!data.fullName || data.fullName.length < 2) throw new Error('FULL_NAME_REQUIRED');
  if (!data.email && !data.phone) throw new Error('CONTACT_REQUIRED');
  if (data.email && !isValidEmail_(data.email)) throw new Error('EMAIL_INVALID');
  if (!data.service) throw new Error('SERVICE_REQUIRED');
  if (!data.description || data.description.length < 30) throw new Error('DESCRIPTION_TOO_SHORT');
  if (String(parameters.consent || '').toLowerCase() !== 'true') throw new Error('CONSENT_REQUIRED');

  if (data.deadline) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.deadline)) throw new Error('DEADLINE_INVALID');
    const today = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd');
    if (data.deadline < today) throw new Error('DEADLINE_PAST');
  }

  if (data.attachmentUrl && !/^https?:\/\/\S+$/i.test(data.attachmentUrl)) {
    throw new Error('URL_INVALID');
  }
  return data;
}

function getRequestSheet_(config) {
  const spreadsheet = SpreadsheetApp.openById(config.spreadsheetId);
  let sheet = spreadsheet.getSheetByName(config.sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(config.sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  } else {
    const actualHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
    if (actualHeaders.join('|') !== HEADERS.join('|')) throw new Error('SHEET_HEADERS_INVALID');
  }
  return sheet;
}

function createUniqueRequestId_(sheet) {
  const date = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyyMMdd');
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  for (let attempt = 0; attempt < 10; attempt += 1) {
    let suffix = '';
    for (let index = 0; index < 4; index += 1) {
      suffix += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    const requestId = 'ML-' + date + '-' + suffix;
    const match = sheet.createTextFinder(requestId).matchEntireCell(true).findNext();
    if (!match) return requestId;
  }
  throw new Error('REQUEST_ID_FAILED');
}

function createFingerprint_(data) {
  const raw = [data.email, data.phone, data.service, data.description].join('|').toLowerCase();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw, Utilities.Charset.UTF_8);
  const hex = digest.map(function (byte) {
    const value = byte < 0 ? byte + 256 : byte;
    return ('0' + value.toString(16)).slice(-2);
  }).join('');
  return 'luuiw-' + hex;
}

function sendNotificationsSafely_(notificationEmail, requestId, createdAt, data) {
  try {
    sendOwnerNotification_(notificationEmail, requestId, createdAt, data);
  } catch (error) {
    console.error('Owner email failed for request %s', requestId);
  }

  if (data.email) {
    try {
      sendCustomerConfirmation_(notificationEmail, requestId, data);
    } catch (error) {
      console.error('Customer confirmation failed for request %s', requestId);
    }
  }
}

function sendOwnerNotification_(notificationEmail, requestId, createdAt, data) {
  const subject = '[Luuiw] Yêu cầu mới ' + requestId + ' — ' + data.service;
  const htmlBody = [
    '<h2>Luuiw có yêu cầu mới</h2>',
    '<p><strong>Mã:</strong> ' + escapeHtml_(requestId) + '</p>',
    '<p><strong>Thời gian:</strong> ' + escapeHtml_(createdAt) + '</p>',
    '<p><strong>Họ tên:</strong> ' + escapeHtml_(data.fullName) + '</p>',
    '<p><strong>Email:</strong> ' + escapeHtml_(data.email || 'Không cung cấp') + '</p>',
    '<p><strong>Điện thoại:</strong> ' + escapeHtml_(data.phone || 'Không cung cấp') + '</p>',
    '<p><strong>Dịch vụ:</strong> ' + escapeHtml_(data.service) + '</p>',
    '<p><strong>Chủ đề:</strong> ' + escapeHtml_(data.subject || 'Không cung cấp') + '</p>',
    '<p><strong>Mô tả:</strong><br>' + escapeHtml_(data.description).replace(/\n/g, '<br>') + '</p>',
    '<p><strong>Thời hạn:</strong> ' + escapeHtml_(data.deadline || 'Chưa xác định') + '</p>',
    '<p><strong>Ngân sách:</strong> ' + escapeHtml_(data.budget || 'Chưa xác định') + '</p>',
    '<p><strong>Liên hệ mong muốn:</strong> ' + escapeHtml_(data.preferredContact) + '</p>',
    '<p><strong>Link tài liệu:</strong> ' + escapeHtml_(data.attachmentUrl || 'Không có') + '</p>',
  ].join('');

  MailApp.sendEmail({
    to: notificationEmail,
    subject: subject,
    body: 'Có yêu cầu Luuiw mới: ' + requestId + '. Mở Google Sheets để xem chi tiết.',
    htmlBody: htmlBody,
    name: 'Luuiw Website',
  });
}

function sendCustomerConfirmation_(notificationEmail, requestId, data) {
  MailApp.sendEmail({
    to: data.email,
    replyTo: notificationEmail,
    subject: 'Luuiw đã tiếp nhận yêu cầu ' + requestId,
    body: 'Luuiw đã nhận yêu cầu của bạn. Mã yêu cầu: ' + requestId + '. Luuiw sẽ kiểm tra và liên hệ trong khung 8:00–24:00.',
    htmlBody:
      '<p>Xin chào ' + escapeHtml_(data.fullName) + ',</p>' +
      '<p>Luuiw đã tiếp nhận yêu cầu của bạn với mã <strong>' + escapeHtml_(requestId) + '</strong>.</p>' +
      '<p>Luuiw sẽ kiểm tra thông tin và liên hệ trong khung 8:00–24:00. Vui lòng giữ lại mã yêu cầu để đối chiếu.</p>' +
      '<p>Cảm ơn bạn,<br><strong>Luuiw</strong></p>',
    name: 'Luuiw',
  });
}

function limitString_(value, maxLength) {
  return String(value == null ? '' : value).trim().slice(0, maxLength);
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sheetSafe_(value) {
  const text = String(value == null ? '' : value);
  return /^[=+\-@]/.test(text.replace(/^\s+/, '')) ? "'" + text : text;
}

function escapeHtml_(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function publicErrorMessage_(errorCode) {
  const validationErrors = {
    FULL_NAME_REQUIRED: 'Vui lòng kiểm tra lại họ tên.',
    CONTACT_REQUIRED: 'Vui lòng nhập email hoặc số điện thoại.',
    EMAIL_INVALID: 'Email chưa đúng định dạng.',
    SERVICE_REQUIRED: 'Vui lòng chọn dịch vụ.',
    DESCRIPTION_TOO_SHORT: 'Mô tả yêu cầu cần chi tiết hơn.',
    CONSENT_REQUIRED: 'Bạn cần đồng ý với chính sách quyền riêng tư.',
    DEADLINE_INVALID: 'Ngày hoàn thành chưa hợp lệ.',
    DEADLINE_PAST: 'Ngày hoàn thành không được ở trong quá khứ.',
    URL_INVALID: 'Link tài liệu chưa hợp lệ.',
  };
  return validationErrors[errorCode] || 'Hệ thống chưa thể tiếp nhận yêu cầu. Vui lòng thử lại hoặc liên hệ trực tiếp.';
}

function htmlResponse_(payload) {
  const safeJson = JSON.stringify(payload).replace(/</g, '\\u003c');
  const html =
    '<!doctype html><html lang="vi"><head><meta charset="utf-8"></head>' +
    '<body><p>Luuiw đang xử lý phản hồi...</p>' +
    '<script>window.parent.postMessage(' + safeJson + ', "*");</script>' +
    '</body></html>';
  return HtmlService.createHtmlOutput(html)
    .setTitle('Luuiw form response')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
