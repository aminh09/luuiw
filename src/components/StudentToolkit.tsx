import { useId, useMemo, useState } from 'react'
import { services } from '../config/services'
import type { Service } from '../types'
import { Icon } from './Icon'
import { SectionHeading } from './SectionHeading'

interface StudentToolkitProps {
  onApplyServiceEstimator?: (service: Service, budget: string, deadlineDays: number) => void
}

interface CourseItem {
  id: string
  name: string
  credits: number
  gradeLetter: string
  score10: string
}

interface FlaggedSentence {
  id: string
  original: string
  risk: 'high' | 'medium' | 'low'
  reason: string
  suggestionA: string
  suggestionB: string
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  A: 4.0,
  'B+': 3.5,
  B: 3.0,
  'C+': 2.5,
  C: 2.0,
  'D+': 1.5,
  D: 1.0,
  F: 0.0,
}

const DEFAULT_COURSES: CourseItem[] = [
  { id: '1', name: 'Triết học Mác - Lênin', credits: 3, gradeLetter: 'B+', score10: '' },
  { id: '2', name: 'Toán cao cấp', credits: 3, gradeLetter: 'A', score10: '' },
  { id: '3', name: 'Lập trình căn bản', credits: 4, gradeLetter: 'A+', score10: '' },
  { id: '4', name: 'Cơ sở dữ liệu', credits: 3, gradeLetter: 'B', score10: '' },
]

const DEFAULT_SERVICE: Service = services[0] as Service

const SAMPLE_PLAGIARISM_TEXT =
  'Trong bối cảnh nền kinh tế thị trường định hướng xã hội chủ nghĩa và hội nhập quốc tế ngày càng sâu rộng, ' +
  'việc ứng dụng công nghệ thông tin và chuyển đổi số đã trở thành yêu cầu cấp thiết đối với mọi tổ chức, doanh nghiệp. ' +
  'Theo nhiều báo cáo gần đây, tỷ lệ số hóa dữ liệu giúp tối ưu hóa từ 30% đến 45% thời gian xử lý thủ tục hành chính. ' +
  'Để đạt được mục tiêu nêu trên, các đơn vị cần xây dựng lộ trình nâng cấp hạ tầng mạng đồng bộ và đào tạo nguồn nhân lực chất lượng cao. ' +
  'Nghiên cứu này tập trung phân tích thực trạng triển khai phần mềm quản lý công việc và đề xuất các giải pháp nâng cao hiệu quả vận hành.'

// ==================== TOOL 1: LOCAL WRITING REVIEW ====================
const CLICHE_PATTERNS: Array<{
  regex: RegExp
  risk: 'high' | 'medium'
  reason: string
  suggestA: (s: string) => string
  suggestB: (s: string) => string
}> = [
  {
    regex: /(trong bối cảnh|kinh tế thị trường|định hướng xã hội chủ nghĩa|hội nhập quốc tế ngày càng sâu rộng|hội nhập kinh tế quốc tế)/i,
    risk: 'high',
    reason: 'Mẫu diễn đạt khái quát, nên làm rõ bối cảnh riêng của đề tài. Không thể kết luận trùng lặp khi chưa đối chiếu với nguồn.',
    suggestA: (s) =>
      s.replace(
        /^(Trong bối cảnh[^,]+,\s*)/i,
        'Xét trong phạm vi nghiên cứu này, '
      ).replace(/ngày càng sâu rộng/i, 'một cách toàn diện'),
    suggestB: (s) =>
      `${s} [Làm rõ bối cảnh cụ thể và nguồn đã kiểm chứng.]`, 
  },
  {
    regex: /(ngày càng phát triển|đóng vai trò quan trọng|đóng vai trò then chốt|không ngừng nâng cao|không thể thiếu)/i,
    risk: 'medium',
    reason: 'Cụm từ mang tính khẩu hiệu định tính chung chung, nên thay bằng số liệu hoặc nhận định có dẫn chứng học thuật cụ thể.',
    suggestA: (s) =>
      s.replace(/đóng vai trò quan trọng/i, 'có vai trò trong')
       .replace(/ngày càng phát triển/i, 'đang có sự thay đổi')
       .replace(/không ngừng nâng cao/i, 'liên tục tối ưu hóa'),
    suggestB: (s) =>
      `${s} [Bổ sung chỉ số đo lường hoặc căn cứ nếu có.]`, 
  },
  {
    regex: /(để đạt được mục tiêu nêu trên|cần phải có những giải pháp|cần xây dựng lộ trình|triển khai đồng bộ)/i,
    risk: 'medium',
    reason: 'Cụm liên kết giải pháp mang tính công thức quen thuộc, nên đi thẳng vào hành động và phân loại nhóm biện pháp cụ thể.',
    suggestA: (s) =>
      s.replace(/để đạt được mục tiêu nêu trên,\s*/i, 'Nhằm hiện thực hóa định hướng chiến lược, ')
       .replace(/cần phải có những giải pháp/i, 'các đơn vị cần ưu tiên ba nhóm biện pháp then chốt'),
    suggestB: (s) =>
      `${s} [Liệt kê các bước triển khai và điều kiện áp dụng.]`, 
  },
  {
    regex: /(thực tiễn cho thấy|thực tiễn đã chứng minh|nghiên cứu này nhằm mục đích)/i,
    risk: 'medium',
    reason: 'Khẳng định chủ quan thiếu chứng cứ thực nghiệm hoặc cấu trúc câu nghiên cứu rập khuôn cần chuẩn hóa.',
    suggestA: (s) =>
      s.replace(/thực tiễn cho thấy( rằng)?/i, 'Thông tin cần kiểm chứng cho thấy')
       .replace(/nghiên cứu này nhằm mục đích/i, 'Mục tiêu trọng tâm của nghiên cứu là'),
    suggestB: (s) =>
      `${s} [Bổ sung dữ liệu hoặc tài liệu có thật.]`, 
  },
]

const STATS_REGEX = /\d+(?:[.,]\d+)?\s*(?:%|phần trăm|triệu|tỷ|nghìn|ngàn|usd|vnd|đồng)(?=$|[\s,.;:!?])/i
const CITATION_REGEX = /(\([A-ZÀ-Ỹa-zà-ỹ\s]+,?\s*\d{4}\)|\[\d+\]|theo\s+[A-ZÀ-Ỹa-zà-ỹ]+)/i

export function StudentToolkit({ onApplyServiceEstimator }: StudentToolkitProps) {
  const [activeTab, setActiveTab] = useState<'plagiarism' | 'gpa' | 'citation' | 'speech' | 'estimator'>('plagiarism')
  const baseId = useId()

  // ==================== TOOL 1: LOCAL WRITING REVIEW ====================
  // Default is completely EMPTY - no fake pre-populated text or canned results!
  const [plagiarismText, setPlagiarismText] = useState('')
  const [scanResult, setScanResult] = useState<{
    scanned: boolean
    wordCount: number
    flaggedSentences: FlaggedSentence[]
  } | null>(null)

  const [selectedFlag, setSelectedFlag] = useState<FlaggedSentence | null>(null)
  const [copiedCleanText, setCopiedCleanText] = useState(false)

  const handleStartScan = () => {
    const rawText = plagiarismText.trim()
    if (!rawText) return

    const words = rawText.split(/\s+/).filter(Boolean)
    const rawSentences = rawText.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter((s) => s.length >= 12)
    const flagged: FlaggedSentence[] = []

    rawSentences.forEach((sentence, index) => {
      let matched = false

      // 1. Check academic clichés
      for (const rule of CLICHE_PATTERNS) {
        if (rule.regex.test(sentence)) {
          flagged.push({
            id: `flag-cliche-${index}`,
            original: sentence,
            risk: rule.risk,
            reason: rule.reason,
            suggestionA: rule.suggestA(sentence),
            suggestionB: rule.suggestB(sentence),
          })
          matched = true
          break
        }
      }

      // 2. Check unreferenced stats
      if (!matched && STATS_REGEX.test(sentence) && !CITATION_REGEX.test(sentence)) {
        flagged.push({
          id: `flag-stat-${index}`,
          original: sentence,
          risk: 'medium',
          reason: 'Câu chứa số liệu nhưng chưa thấy trích dẫn trong cùng câu. Cần kiểm tra nguồn và danh mục tài liệu tham khảo.',
          suggestionA: `${sentence} [Bổ sung nguồn dữ liệu có thể kiểm chứng.]`, 
          suggestionB: `${sentence} [Cần bổ sung tác giả, năm hoặc URL nguồn có thật]`, 
        })
        matched = true
      }

      // 3. Check overly long sentences
      if (!matched && sentence.split(/\s+/).length > 40) {
        flagged.push({
          id: `flag-long-${index}`,
          original: sentence,
          risk: 'medium',
          reason: 'Câu quá dài (> 40 từ), có thể khó đọc và cần cân nhắc tách ý; độ dài không chứng minh đạo văn.',
          suggestionA: `${sentence} [Cân nhắc tách câu thành hai ý độc lập.]`,
          suggestionB: `${sentence} [Tóm lược nội dung không trực tiếp phục vụ luận điểm.]`,
        })
      }
    })

    // Heuristic local review only: no similarity percentage or external corpus comparison.
    setScanResult({
      scanned: true,
      wordCount: words.length,
      flaggedSentences: flagged,
    })
    setSelectedFlag(flagged[0] ?? null)
  }

  const handleApplyParaphrase = (original: string, replacement: string) => {
    const updated = plagiarismText.replace(original, replacement)
    setPlagiarismText(updated)

    // The text changed; the previous findings are stale until the user rescans it.
    setScanResult(null)
    setSelectedFlag(null)
  }

  const handleCopyCleanText = async () => {
    try {
      await navigator.clipboard.writeText(plagiarismText)
      setCopiedCleanText(true)
      setTimeout(() => setCopiedCleanText(false), 2000)
    } catch {
      // Fallback
    }
  }

  // ==================== TOOL 2: GPA CALCULATOR ====================
  const [courses, setCourses] = useState<CourseItem[]>(DEFAULT_COURSES)
  const [targetGpa, setTargetGpa] = useState<number>(3.6)
  const [remainingCredits, setRemainingCredits] = useState<number>(15)

  const gpaStats = useMemo(() => {
    let totalCredits = 0
    let totalPoints = 0
    let totalPoints10 = 0
    let allScores10Entered = true
    courses.forEach((c) => {
      const credits = Number.isFinite(c.credits) ? Math.max(0, c.credits) : 0
      const pts = GRADE_POINTS[c.gradeLetter] ?? 0
      totalCredits += credits
      totalPoints += pts * credits
      const score10 = Number(c.score10)
      if (c.score10.trim() === '' || !Number.isFinite(score10) || score10 < 0 || score10 > 10) {
        allScores10Entered = false
      } else {
        totalPoints10 += score10 * credits
      }
    })
    const currentGpa = totalCredits > 0 ? totalPoints / totalCredits : 0
    const academicStanding = totalCredits === 0 ? 'Chưa xác định'
      : currentGpa >= 3.6 ? 'Xuất sắc (tham khảo)'
      : currentGpa >= 3.2 ? 'Giỏi (tham khảo)'
      : currentGpa >= 2.5 ? 'Khá (tham khảo)'
      : currentGpa >= 2.0 ? 'Trung bình (tham khảo)'
      : 'Dưới trung bình (tham khảo)'

    const neededPoints = targetGpa * (totalCredits + remainingCredits) - totalPoints
    const requiredGpa = remainingCredits > 0 ? neededPoints / remainingCredits : NaN

    return {
      totalCredits,
      currentGpa: Number(currentGpa.toFixed(2)),
      gpa10: allScores10Entered && totalCredits > 0 ? (totalPoints10 / totalCredits).toFixed(2) : null,
      academicStanding,
      requiredGpa,
    }
  }, [courses, remainingCredits, targetGpa])

  const addCourse = () => {
    const nextNum = courses.length + 1
    setCourses([
      ...courses,
      {
        id: String(Date.now()),
        name: `Học phần ${nextNum}`,
        credits: 3,
        gradeLetter: 'A',
        score10: '',
      },
    ])
  }

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return
    setCourses(courses.filter((c) => c.id !== id))
  }

  const updateCourse = (id: string, field: keyof CourseItem, value: string | number) => {
    setCourses(
      courses.map((c) => {
        if (c.id !== id) return c
        return { ...c, [field]: value }
      }),
    )
  }

  // ==================== TOOL 3: CITATION GENERATOR ====================
  const [citeFormat, setCiteFormat] = useState<'apa' | 'ieee' | 'harvard'>('apa')
  const [sourceType, setSourceType] = useState<'article' | 'book' | 'website'>('article')
  const [citeAuthor, setCiteAuthor] = useState('')
  const [citeYear, setCiteYear] = useState('')
  const [citeTitle, setCiteTitle] = useState('')
  const [citeContainer, setCiteContainer] = useState('')
  const [citeUrl, setCiteUrl] = useState('')
  const [copiedCitation, setCopiedCitation] = useState(false)

  const formattedCitation = useMemo(() => {
    const author = citeAuthor.trim()
    const year = citeYear.trim()
    const title = citeTitle.trim()
    const container = citeContainer.trim()
    const link = citeUrl.trim()
    if (!author || !year || !title || !container) return ''

    if (citeFormat === 'apa') {
      if (sourceType === 'book') return `${author} (${year}). ${title}. ${container}.${link ? ` ${link}` : ''}`
      return `${author} (${year}). ${title}. ${container}.${link ? ` ${link}` : ''}`
    }
    if (citeFormat === 'ieee') {
      if (sourceType === 'book') {
        return `${author}, ${title}. ${container}, ${year}.${link ? ` [Online]. Available: ${link}` : ''}`
      }
      return `${author}, "${title}," ${container}, ${year}.${link ? ` [Online]. Available: ${link}` : ''}`
    }
    if (sourceType === 'book') return `${author} (${year}) ${title}. ${container}.${link ? ` Available at: ${link}.` : ''}`
    return `${author} (${year}) '${title}', ${container}.${link ? ` Available at: ${link}.` : ''}`
  }, [citeAuthor, citeContainer, citeFormat, citeTitle, citeUrl, citeYear, sourceType])

  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(formattedCitation)
      setCopiedCitation(true)
      setTimeout(() => setCopiedCitation(false), 2000)
    } catch {
      // Fallback
    }
  }

  // ==================== TOOL 4: SPEECH ESTIMATOR ====================
  const [speechText, setSpeechText] = useState('')
  const speechStats = useMemo(() => {
    const words = speechText.trim() ? speechText.trim().split(/\s+/).length : 0
    const chars = speechText.length
    const speechMinutes = words > 0 ? (words / 130).toFixed(1) : '0'
    const readingMinutes = words > 0 ? (words / 220).toFixed(1) : '0'
    const suggestedSlides = words > 0 ? Math.max(3, Math.ceil(Number(speechMinutes) / 2)) : 0
    return { words, chars, speechMinutes, readingMinutes, suggestedSlides }
  }, [speechText])

  // ==================== TOOL 5: COST & TIME ESTIMATOR ====================
  const [selectedServiceId, setSelectedServiceId] = useState(DEFAULT_SERVICE.id)
  const [complexity, setComplexity] = useState<'basic' | 'standard' | 'advanced'>('standard')
  const [urgency, setUrgency] = useState<'normal' | 'rush'>('normal')

  const estimatedOutcome = useMemo(() => {
    const svc: Service = services.find((s) => s.id === selectedServiceId) ?? DEFAULT_SERVICE
    let baseMin = 150
    let baseMax = 350
    let days = 4

    if (svc.group === 'Lập trình' || svc.group === 'Dữ liệu') {
      baseMin = 250
      baseMax = 600
      days = 5
    } else if (svc.group === 'Mô hình hệ thống') {
      baseMin = 200
      baseMax = 450
      days = 3
    } else if (svc.group === 'Học thuật') {
      baseMin = 200
      baseMax = 500
      days = 4
    } else if (svc.group === 'Trình bày' || svc.group === 'Nghề nghiệp') {
      baseMin = 120
      baseMax = 300
      days = 3
    }

    if (complexity === 'basic') {
      baseMin = Math.round(baseMin * 0.8)
      baseMax = Math.round(baseMax * 0.8)
      days = Math.max(2, days - 1)
    } else if (complexity === 'advanced') {
      baseMin = Math.round(baseMin * 1.5)
      baseMax = Math.round(baseMax * 1.6)
      days = days + 2
    }

    if (urgency === 'rush') {
      baseMin = Math.round(baseMin * 1.3)
      baseMax = Math.round(baseMax * 1.35)
      days = Math.max(1, Math.round(days / 2))
    }

    const priceRange = `${baseMin}.000đ – ${baseMax}.000đ`
    const timeText = urgency === 'rush' ? `${days} ngày (Hỏa tốc)` : `${days}–${days + 2} ngày (Tiêu chuẩn)`

    return { service: svc, priceRange, timeText, days }
  }, [complexity, selectedServiceId, urgency])

  return (
    <section className="section toolkit-section" id="cong-cu">
      <div className="container">
        <SectionHeading
          badge="Hệ thống 5 tiện ích sinh viên"
          description="Rà soát cách viết và nguồn trích dẫn trên thiết bị, tính GPA, tạo bản nháp trích dẫn và dự toán tham khảo miễn phí."
          eyebrow="Student Academic Toolkit"
          title="Trung tâm Tiện ích Học tập Thông minh"
        />

        {/* Tab switcher */}
        <div aria-label="Chọn công cụ học tập" className="toolkit-tabs" role="tablist">
          <button
            aria-selected={activeTab === 'plagiarism'}
            className={`toolkit-tab-btn ${activeTab === 'plagiarism' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('plagiarism')}
            role="tab"
            type="button"
          >
            <Icon name="scan" size={19} />
            <span>Rà soát văn bản học thuật</span>
            <span className="toolkit-new-tag">Mới</span>
          </button>
          <button
            aria-selected={activeTab === 'gpa'}
            className={`toolkit-tab-btn ${activeTab === 'gpa' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('gpa')}
            role="tab"
            type="button"
          >
            <Icon name="calculator" size={19} />
            <span>Tính GPA & Xếp loại</span>
          </button>
          <button
            aria-selected={activeTab === 'citation'}
            className={`toolkit-tab-btn ${activeTab === 'citation' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('citation')}
            role="tab"
            type="button"
          >
            <Icon name="quote" size={19} />
            <span>Tạo trích dẫn APA, IEEE & Harvard</span>
          </button>
          <button
            aria-selected={activeTab === 'speech'}
            className={`toolkit-tab-btn ${activeTab === 'speech' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('speech')}
            role="tab"
            type="button"
          >
            <Icon name="clock" size={19} />
            <span>Thời lượng thuyết trình</span>
          </button>
          <button
            aria-selected={activeTab === 'estimator'}
            className={`toolkit-tab-btn ${activeTab === 'estimator' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('estimator')}
            role="tab"
            type="button"
          >
            <Icon name="chart" size={19} />
            <span>Dự toán chi phí & Hạn nộp</span>
          </button>
        </div>

        {/* ==================== TAB 1: PLAGIARISM CHECKER ==================== */}
        {activeTab === 'plagiarism' && (
          <div className="toolkit-card view-fade-in" id="dao-van" role="tabpanel">
            <div className="toolkit-grid">
              <div className="toolkit-main-panel">
                <div className="toolkit-panel-header">
                  <div>
                    <h3>Rà soát cách diễn đạt & trích dẫn học thuật</h3>
                    <p>Phát hiện một số mẫu diễn đạt chung, số liệu cần dẫn nguồn và câu dài; không tra cứu kho luận văn hoặc đo tỷ lệ trùng lặp.</p>
                  </div>
                  <div className="panel-actions-row">
                    <button
                      className="button button--small button--ghost"
                      onClick={() => { setPlagiarismText(SAMPLE_PLAGIARISM_TEXT); setScanResult(null); setSelectedFlag(null) }}
                      title="Nạp một đoạn văn bản mẫu để kiểm tra tính năng"
                      type="button"
                    >
                      Dán văn bản mẫu
                    </button>
                    {plagiarismText && (
                      <button
                        className="text-button"
                        onClick={() => {
                          setPlagiarismText('')
                          setScanResult(null)
                          setSelectedFlag(null)
                        }}
                        type="button"
                      >
                        Xóa nội dung
                      </button>
                    )}
                  </div>
                </div>

                <div className="plagiarism-config-row">
                  <p className="toolkit-footnote">
                    Chỉ phân tích nội dung bạn nhập ngay trong trình duyệt. Đây không phải công cụ kiểm tra đạo văn, Turnitin hay DoIT.
                  </p>
                  <button
                    className="button button--primary scan-trigger-btn"
                    disabled={!plagiarismText.trim()}
                    onClick={handleStartScan}
                    type="button"
                  >
                    <Icon name="scan" size={18} /> Rà soát văn bản
                  </button>
                </div>

                <div className="field field--wide">
                  <div className="label-row">
                    <label htmlFor={`${baseId}-plag-text`}>Nội dung bài viết cần kiểm tra:</label>
                    <span>{plagiarismText.trim() ? plagiarismText.trim().split(/\s+/).filter(Boolean).length : 0} từ</span>
                  </div>
                  <textarea
                    id={`${baseId}-plag-text`}
                    onChange={(e) => { setPlagiarismText(e.target.value); setScanResult(null); setSelectedFlag(null) }}
                    placeholder="Dán hoặc nhập đoạn văn bản tiểu luận, phần đặt vấn đề, tổng quan tài liệu hoặc bài báo cáo cần rà soát vào đây..."
                    rows={8}
                    value={plagiarismText}
                  />
                </div>

                {/* Clean State (0 flags) */}
                {scanResult && scanResult.flaggedSentences.length === 0 && (
                  <div className="clean-findings-box">
                    <div className="clean-icon-wrap">
                      <Icon name="check" size={24} />
                    </div>
                    <div>
                      <h4>Chưa phát hiện dấu hiệu cần rà soát theo bộ quy tắc hiện tại</h4>
                      <p>Không phát hiện mẫu câu được cấu hình, số liệu cần dẫn nguồn hoặc câu quá dài. Điều này không chứng minh văn bản nguyên bản và không thay thế kiểm tra với nguồn thực tế.</p>
                    </div>
                  </div>
                )}

                {/* Flagged sentences list */}
                {scanResult && scanResult.flaggedSentences.length > 0 && (
                  <div className="flagged-findings-box">
                    <div className="findings-header">
                      <h4>
                        <Icon name="alert" size={18} /> Có {scanResult.flaggedSentences.length} câu cần tự rà soát:
                      </h4>
                      <small>Nhấp vào từng câu bên dưới để xem phương án viết lại tự động</small>
                    </div>

                    <div className="findings-list">
                      {scanResult.flaggedSentences.map((flag) => (
                        <div
                          className={`finding-item finding--${flag.risk} ${selectedFlag?.id === flag.id ? 'is-selected' : ''}`}
                          key={flag.id}
                          onClick={() => setSelectedFlag(flag)}
                        >
                          <div className="finding-header-line">
                            <span className="risk-indicator">
                              {flag.risk === 'high' ? 'Ưu tiên xem lại' : 'Cần rà soát'}
                            </span>
                            <span className="flag-reason-snippet">{flag.reason}</span>
                          </div>
                          <p className="finding-original-text">"{flag.original}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar result */}
              <div className="toolkit-sidebar-panel">
                <div className="plagiarism-result-card">
                  <span className="result-label">Kết quả rà soát nội dung (nội bộ)</span>
                  {scanResult ? (
                    <>
                      <div className="plagiarism-score-row">
                        <div className="score-block">
                          <span className="score-num score-sim">{scanResult.flaggedSentences.length}</span>
                          <small>Câu nên kiểm tra</small>
                        </div>
                        <div className="score-divider" />
                        <div className="score-block">
                          <span className="score-num score-orig">{scanResult.wordCount}</span>
                          <small>Từ đã phân tích</small>
                        </div>
                      </div>
                      <p className="toolkit-footnote">Không có điểm phần trăm tương đồng vì công cụ không đối chiếu cơ sở dữ liệu bên ngoài.</p>

                      {/* Paraphrasing Assistant */}
                      {selectedFlag ? (
                        <div className="paraphrase-assistant">
                          <div className="assistant-heading">
                            <strong>Trợ lý viết lại (Paraphrase)</strong>
                            <small>Đây là bản nháp gợi ý; chỗ trong ngoặc vuông cần bạn tự xác minh và hoàn thiện.</small>
                          </div>

                          <div className="paraphrase-option">
                            <span className="option-title">Cách 1: Đổi cấu trúc câu & Từ đồng nghĩa</span>
                            <p>{selectedFlag.suggestionA}</p>
                            <button
                              className="button button--small button--secondary"
                              onClick={() => handleApplyParaphrase(selectedFlag.original, selectedFlag.suggestionA)}
                              type="button"
                            >
                              Chèn bản nháp vào văn bản
                            </button>
                          </div>

                          <div className="paraphrase-option">
                            <span className="option-title">Cách 2: Tóm lược & Bổ sung trích dẫn</span>
                            <p>{selectedFlag.suggestionB}</p>
                            <button
                              className="button button--small button--secondary"
                              onClick={() => handleApplyParaphrase(selectedFlag.original, selectedFlag.suggestionB)}
                              type="button"
                            >
                              Chèn bản nháp vào văn bản
                            </button>
                          </div>
                        </div>
                      ) : scanResult.flaggedSentences.length > 0 ? (
                        <div className="assistant-placeholder">
                          <p>💡 Chọn một câu nghi vấn bên trái để xem phương án viết lại tự động.</p>
                        </div>
                      ) : null}

                      <button
                        className="button button--primary button--full"
                        onClick={handleCopyCleanText}
                        style={{ marginTop: '16px' }}
                        type="button"
                      >
                        <Icon name={copiedCleanText ? 'check' : 'copy'} size={18} />
                        <span>{copiedCleanText ? 'Đã sao chép văn bản vào Clipboard!' : 'Sao chép văn bản đang có'}</span>
                      </button>
                    </>
                  ) : (
                    <div className="ready-scan-card">
                      <div className="ready-badge">
                        <Icon name="shield" size={16} />
                        <span>Sẵn sàng rà soát</span>
                      </div>
                      <h4>Danh sách kiểm tra cách viết</h4>
                      <p className="ready-desc">
                        Nhập hoặc dán nội dung bài viết vào khung bên trái và bấm <strong>"Rà soát văn bản"</strong>.
                      </p>

                      <div className="criteria-checklist">
                        <div className="criterion-item">
                          <Icon name="check" size={15} />
                          <div>
                            <strong>Quét mẫu câu rập khuôn đại cương</strong>
                            <small>Nhận diện cấu trúc mở đầu, liên từ sáo rỗng quen thuộc</small>
                          </div>
                        </div>
                        <div className="criterion-item">
                          <Icon name="check" size={15} />
                          <div>
                            <strong>Kiểm tra dẫn chứng số liệu</strong>
                            <small>Cảnh báo các tỷ lệ %, số lượng định lượng thiếu trích dẫn</small>
                          </div>
                        </div>
                        <div className="criterion-item">
                          <Icon name="check" size={15} />
                          <div>
                            <strong>Gợi ý viết lại (Paraphrase) 1-click</strong>
                            <small>Cung cấp câu thay thế chuẩn phong cách học thuật</small>
                          </div>
                        </div>
                        <div className="criterion-item">
                          <Icon name="check" size={15} />
                          <div>
                            <strong>Không tính điểm trùng lặp</strong>
                            <small>Muốn biết tỷ lệ tương đồng cần dùng hệ thống đối chiếu nguồn riêng</small>
                          </div>
                        </div>
                      </div>

                      <div className="ready-cta-box">
                        <small>Bạn chưa có văn bản sẵn sàng?</small>
                        <button
                          className="button button--small button--ghost button--full"
                          onClick={() => { setPlagiarismText(SAMPLE_PLAGIARISM_TEXT); setScanResult(null); setSelectedFlag(null) }}
                          type="button"
                        >
                          Dán đoạn văn bản mẫu để kiểm tra thử
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="toolkit-footnote">
                    * Công cụ chỉ đối chiếu các biểu thức quy tắc (regex) ở phía trình duyệt, không truy cập cơ sở dữ liệu, không ước tính tỷ lệ tương đồng thực tế.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: GPA CALCULATOR ==================== */}
        {activeTab === 'gpa' && (
          <div className="toolkit-card view-fade-in" role="tabpanel">
            <div className="toolkit-grid">
              <div className="toolkit-main-panel">
                <div className="toolkit-panel-header">
                  <div>
                    <h3>Danh sách học phần kỳ này</h3>
                    <p>4 học phần ban đầu là dữ liệu mẫu. Hãy sửa theo bảng điểm thật; điểm chữ và tín chỉ dùng tính hệ 4, điểm hệ 10 chỉ được tính khi bạn nhập đầy đủ số điểm thực tế.</p>
                  </div>
                  <button className="button button--small button--ghost" onClick={addCourse} type="button">
                    + Thêm môn học
                  </button>
                </div>

                <div className="gpa-table-wrapper">
                  <table className="gpa-table">
                    <thead>
                      <tr>
                        <th>Tên môn học</th>
                        <th style={{ width: '90px' }}>Số TC</th>
                        <th style={{ width: '110px' }}>Điểm chữ</th>
                        <th style={{ width: '90px' }}>Hệ 4</th>
                        <th style={{ width: '110px' }}>Hệ 10</th>
                        <th style={{ width: '60px' }}>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course.id}>
                          <td>
                            <input
                              aria-label="Tên môn học"
                              className="table-input"
                              onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                              value={course.name}
                            />
                          </td>
                          <td>
                            <input
                              aria-label="Số tín chỉ"
                              className="table-input"
                              max={10}
                              min={1}
                              onChange={(e) => updateCourse(course.id, 'credits', Number(e.target.value) || 1)}
                              type="number"
                              value={course.credits}
                            />
                          </td>
                          <td>
                            <select
                              aria-label="Điểm chữ"
                              className="table-select"
                              onChange={(e) => updateCourse(course.id, 'gradeLetter', e.target.value)}
                              value={course.gradeLetter}
                            >
                              {Object.keys(GRADE_POINTS).map((g) => (
                                <option key={g} value={g}>
                                  {g} ({(GRADE_POINTS[g] ?? 0).toFixed(1)})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <strong className="gpa-point-badge">
                              {(GRADE_POINTS[course.gradeLetter] ?? 0).toFixed(1)}
                            </strong>
                          </td>
                          <td>
                            <input
                              aria-label={`Điểm hệ 10 của ${course.name}`}
                              className="table-input"
                              max={10}
                              min={0}
                              onChange={(e) => updateCourse(course.id, 'score10', e.target.value)}
                              placeholder="Chưa có"
                              step={0.1}
                              type="number"
                              value={course.score10}
                            />
                          </td>
                          <td>
                            <button
                              aria-label={`Xóa môn ${course.name}`}
                              className="icon-delete-btn"
                              disabled={courses.length <= 1}
                              onClick={() => removeCourse(course.id)}
                              type="button"
                            >
                              <Icon name="close" size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Target GPA Planner */}
                <div className="gpa-target-box">
                  <h4>Dự phóng nâng hạng bằng tốt nghiệp</h4>
                  <div className="gpa-target-controls">
                    <div>
                      <label htmlFor={`${baseId}-target-gpa`}>GPA mục tiêu trên toàn bộ tín chỉ nhập:</label>
                      <input
                        id={`${baseId}-target-gpa`}
                        max={4.0}
                        min={0}
                        onChange={(e) => setTargetGpa(Number(e.target.value))}
                        step={0.05}
                        type="number"
                        value={targetGpa}
                      />
                    </div>
                    <div>
                      <label htmlFor={`${baseId}-rem-creds`}>Số tín chỉ còn lại:</label>
                      <input
                        id={`${baseId}-rem-creds`}
                        max={120}
                        min={0}
                        onChange={(e) => setRemainingCredits(Math.max(0, Number(e.target.value) || 0))}
                        type="number"
                        value={remainingCredits}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar result */}
              <div className="toolkit-sidebar-panel">
                <div className="gpa-result-card">
                    <span className="result-label">GPA theo học phần đã nhập (Hệ 4)</span>
                  <div className="gpa-big-number">{gpaStats.currentGpa.toFixed(2)}</div>
                  <div className="gpa-sub-score">Điểm trung bình hệ 10: <strong>{gpaStats.gpa10 === null ? 'Chưa đủ dữ liệu' : `${gpaStats.gpa10} / 10`}</strong></div>

                  <div className="gpa-meta-group">
                    <div className="gpa-meta-item">
                      <span>Tổng tín chỉ:</span>
                      <strong>{gpaStats.totalCredits} TC</strong>
                    </div>
                    <div className="gpa-meta-item">
                      <span>Xếp loại học lực:</span>
                      <strong className="highlight-tag">{gpaStats.academicStanding}</strong>
                    </div>
                    <div className="gpa-meta-item">
                      <span>GPA cần đạt kỳ tới:</span>
                      <strong className={gpaStats.requiredGpa > 4 ? 'danger-tag' : 'highlight-tag'}>
                        {!Number.isFinite(gpaStats.requiredGpa) ? 'Chưa có tín chỉ còn lại' : gpaStats.requiredGpa > 4 ? 'Vượt quá 4.0' : `${Math.max(0, gpaStats.requiredGpa).toFixed(2)} / 4.0`}
                      </strong>
                    </div>
                  </div>
                  <p className="gpa-note">
                    {gpaStats.requiredGpa > 4
                      ? '⚠️ Số tín chỉ còn lại không đủ để đạt mục tiêu này, bạn cần kéo thêm tín chỉ hoặc cải thiện môn cũ.'
                      : '💡 Kết quả là dự báo theo dữ liệu đã nhập. Điểm hệ 10 cần nhập từ bảng điểm thật và thang quy đổi/xếp loại tùy theo trường.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: CITATION GENERATOR ==================== */}
        {activeTab === 'citation' && (
          <div className="toolkit-card view-fade-in" role="tabpanel">
            <div className="toolkit-grid">
              <div className="toolkit-main-panel">
                <div className="toolkit-panel-header">
                  <div>
                    <h3>Trình tạo trích dẫn tài liệu tham khảo</h3>
                    <p>Tạo bản nháp APA 7, IEEE hoặc Harvard từ thông tin nguồn có thật do bạn cung cấp; cần tự kiểm tra chi tiết.</p>
                  </div>
                </div>

                <div className="citation-format-selector">
                  <div className="selector-group">
                    <span className="group-label">Định dạng:</span>
                    <button
                      className={`pill-btn ${citeFormat === 'apa' ? 'is-active' : ''}`}
                      onClick={() => setCiteFormat('apa')}
                      type="button"
                    >
                      APA 7th
                    </button>
                    <button
                      className={`pill-btn ${citeFormat === 'ieee' ? 'is-active' : ''}`}
                      onClick={() => setCiteFormat('ieee')}
                      type="button"
                    >
                      IEEE
                    </button>
                    <button
                      className={`pill-btn ${citeFormat === 'harvard' ? 'is-active' : ''}`}
                      onClick={() => setCiteFormat('harvard')}
                      type="button"
                    >
                      Harvard
                    </button>
                  </div>
                  <div className="selector-group">
                    <span className="group-label">Loại nguồn:</span>
                    <button
                      className={`pill-btn ${sourceType === 'article' ? 'is-active' : ''}`}
                      onClick={() => setSourceType('article')}
                      type="button"
                    >
                      Bài báo / Tạp chí
                    </button>
                    <button
                      className={`pill-btn ${sourceType === 'book' ? 'is-active' : ''}`}
                      onClick={() => setSourceType('book')}
                      type="button"
                    >
                      Sách giáo trình
                    </button>
                    <button
                      className={`pill-btn ${sourceType === 'website' ? 'is-active' : ''}`}
                      onClick={() => setSourceType('website')}
                      type="button"
                    >
                      Trang web / Báo điện tử
                    </button>
                  </div>
                </div>

                <div className="citation-inputs-grid">
                  <div className="field">
                    <label htmlFor={`${baseId}-cite-author`}>Tác giả (Họ & Tên):</label>
                    <input
                      id={`${baseId}-cite-author`}
                      onChange={(e) => setCiteAuthor(e.target.value)}
                      placeholder="Nguyễn Văn A, & Trần Thị B"
                      value={citeAuthor}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`${baseId}-cite-year`}>Năm xuất bản:</label>
                    <input
                      id={`${baseId}-cite-year`}
                      onChange={(e) => setCiteYear(e.target.value)}
                      placeholder="2024"
                      value={citeYear}
                    />
                  </div>
                  <div className="field field--wide">
                    <label htmlFor={`${baseId}-cite-title`}>Tiêu đề bài viết / Công trình:</label>
                    <input
                      id={`${baseId}-cite-title`}
                      onChange={(e) => setCiteTitle(e.target.value)}
                      placeholder="Tiêu đề nghiên cứu hoặc tên sách..."
                      value={citeTitle}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`${baseId}-cite-container`}>
                      {sourceType === 'book' ? 'Nhà xuất bản' : sourceType === 'website' ? 'Tên Website / Tổ chức' : 'Tên Tạp chí / Kỷ yếu'}:
                    </label>
                    <input
                      id={`${baseId}-cite-container`}
                      onChange={(e) => setCiteContainer(e.target.value)}
                      placeholder="Ví dụ: Tạp chí Kinh tế & Phát triển"
                      value={citeContainer}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`${baseId}-cite-url`}>DOI hoặc URL liên kết:</label>
                    <input
                      id={`${baseId}-cite-url`}
                      onChange={(e) => setCiteUrl(e.target.value)}
                      placeholder="https://..."
                      value={citeUrl}
                    />
                  </div>
                </div>
              </div>

              <div className="toolkit-sidebar-panel">
                <div className="citation-result-card">
                  <span className="result-label">Kết quả trích dẫn ({citeFormat.toUpperCase()})</span>
                  <div className="citation-output-box">
                    <p>{formattedCitation || 'Nhập tác giả, năm, tiêu đề và tên nguồn thật để tạo trích dẫn.'}</p>
                  </div>
                  <button className="button button--primary button--full" disabled={!formattedCitation} onClick={copyCitation} type="button">
                    <Icon name={copiedCitation ? 'check' : 'copy'} size={18} />
                    <span>{copiedCitation ? 'Đã sao chép vào Clipboard!' : 'Sao chép trích dẫn'}</span>
                  </button>
                  <p className="citation-tip">
                    💡 Đây chỉ là bản nháp định dạng từ thông tin bạn nhập. Hãy xác minh nguồn thật và kiểm tra quy định cụ thể của trường (tên tác giả, trang, số tập, DOI...) trước khi nộp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: SPEECH ESTIMATOR ==================== */}
        {activeTab === 'speech' && (
          <div className="toolkit-card view-fade-in" role="tabpanel">
            <div className="toolkit-grid">
              <div className="toolkit-main-panel">
                <div className="toolkit-panel-header">
                  <div>
                    <h3>Ước tính thời lượng thuyết trình & Phân tích văn bản</h3>
                    <p>Dán bài báo cáo hoặc kịch bản thuyết trình để tính thời gian nói, đọc thầm và số slide PowerPoint tương ứng.</p>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor={`${baseId}-speech-text`}>Nội dung kịch bản hoặc văn bản thuyết trình:</label>
                  <textarea
                    id={`${baseId}-speech-text`}
                    onChange={(e) => setSpeechText(e.target.value)}
                    placeholder="Dán văn bản bài thuyết trình vào đây..."
                    rows={8}
                    value={speechText}
                  />
                </div>
              </div>

              <div className="toolkit-sidebar-panel">
                <div className="speech-result-card">
                  <span className="result-label">Thông số thuyết trình</span>
                  <div className="speech-big-time">
                    {speechStats.speechMinutes} <small>phút</small>
                  </div>
                  <span className="speech-badge">Tốc độ thuyết trình chuẩn (130 từ/phút)</span>

                  <div className="speech-stats-list">
                    <div className="speech-stat-row">
                      <span>Số từ (Words):</span>
                      <strong>{speechStats.words} từ</strong>
                    </div>
                    <div className="speech-stat-row">
                      <span>Số ký tự:</span>
                      <strong>{speechStats.chars} ký tự</strong>
                    </div>
                    <div className="speech-stat-row">
                      <span>Thời gian đọc thầm:</span>
                      <strong>~{speechStats.readingMinutes} phút</strong>
                    </div>
                    <div className="speech-stat-row">
                      <span>Số slide gợi ý:</span>
                      <strong className="highlight-tag">~{speechStats.suggestedSlides} slide</strong>
                    </div>
                  </div>
                  <p className="speech-note">
                    📌 Lưu ý: Mỗi slide nên trình bày từ 1.5 - 2.5 phút để người nghe kịp theo dõi nội dung và đặt câu hỏi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: COST & TIME ESTIMATOR ==================== */}
        {activeTab === 'estimator' && (
          <div className="toolkit-card view-fade-in" role="tabpanel">
            <div className="toolkit-grid">
              <div className="toolkit-main-panel">
                <div className="toolkit-panel-header">
                  <div>
                    <h3>Bảng dự toán chi phí & thời gian tham khảo</h3>
                    <p>Ước lượng minh họa theo nhóm dịch vụ và mức độ phức tạp, không phải báo giá hay cam kết tiến độ chính thức.</p>
                  </div>
                </div>

                <div className="estimator-controls">
                  <div className="field">
                    <label htmlFor={`${baseId}-sel-service`}>Dịch vụ mong muốn:</label>
                    <select
                      id={`${baseId}-sel-service`}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      value={selectedServiceId}
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.group})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label>Mức độ phức tạp:</label>
                    <div className="radio-group-cool">
                      <label className={`radio-pill ${complexity === 'basic' ? 'is-selected' : ''}`}>
                        <input
                          checked={complexity === 'basic'}
                          name="complexity"
                          onChange={() => setComplexity('basic')}
                          type="radio"
                        />
                        <span>Cơ bản (Đơn giản, sẵn tài liệu)</span>
                      </label>
                      <label className={`radio-pill ${complexity === 'standard' ? 'is-selected' : ''}`}>
                        <input
                          checked={complexity === 'standard'}
                          name="complexity"
                          onChange={() => setComplexity('standard')}
                          type="radio"
                        />
                        <span>Tiêu chuẩn (Có rà soát & định dạng)</span>
                      </label>
                      <label className={`radio-pill ${complexity === 'advanced' ? 'is-selected' : ''}`}>
                        <input
                          checked={complexity === 'advanced'}
                          name="complexity"
                          onChange={() => setComplexity('advanced')}
                          type="radio"
                        />
                        <span>Chuyên sâu (Cần nghiên cứu / code phức tạp)</span>
                      </label>
                    </div>
                  </div>

                  <div className="field">
                    <label>Thời hạn tiến độ:</label>
                    <div className="radio-group-cool">
                      <label className={`radio-pill ${urgency === 'normal' ? 'is-selected' : ''}`}>
                        <input
                          checked={urgency === 'normal'}
                          name="urgency"
                          onChange={() => setUrgency('normal')}
                          type="radio"
                        />
                        <span>Tiến độ tiêu chuẩn (3 – 7 ngày)</span>
                      </label>
                      <label className={`radio-pill ${urgency === 'rush' ? 'is-selected' : ''}`}>
                        <input
                          checked={urgency === 'rush'}
                          name="urgency"
                          onChange={() => setUrgency('rush')}
                          type="radio"
                        />
                        <span>Hỏa tốc / Ưu tiên cao (24h – 48h)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="toolkit-sidebar-panel">
                <div className="estimator-result-card">
                  <span className="result-label">Dự toán tham khảo</span>
                  <div className="estimator-price">{estimatedOutcome.priceRange}</div>
                  <p className="toolkit-footnote">Con số được tính từ mức tham khảo trong công cụ, cần trao đổi trực tiếp để xác nhận chi phí và thời gian.</p>
                  <div className="estimator-time">
                    <Icon name="clock" size={17} />
                    <span>Thời gian: {estimatedOutcome.timeText}</span>
                  </div>

                  <div className="estimator-summary">
                    <p>
                      Dịch vụ: <strong>{estimatedOutcome.service.name}</strong>
                    </p>
                    <p>
                      Bàn giao: <span>{estimatedOutcome.service.deliverables.slice(0, 2).join(', ')}...</span>
                    </p>
                  </div>

                  {onApplyServiceEstimator && (
                    <button
                      className="button button--primary button--full"
                      onClick={() =>
                        onApplyServiceEstimator(
                          estimatedOutcome.service,
                          estimatedOutcome.priceRange,
                          estimatedOutcome.days,
                        )
                      }
                      type="button"
                    >
                      <span>Áp dụng vào Form yêu cầu</span>
                      <Icon name="arrow-right" size={18} />
                    </button>
                  )}

                  <p className="estimator-footnote">
                    * Mức giá mang tính tham khảo để sinh viên dễ dự trù ngân sách. Chi phí chính xác sẽ được trao đổi sau khi Luuiw đọc đề bài chi tiết.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
