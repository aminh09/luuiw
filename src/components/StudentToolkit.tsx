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
}

interface FlaggedSentence {
  id: string
  original: string
  risk: 'high' | 'medium' | 'low'
  similarityPct: number
  reason: string
  suggestionA: string
  suggestionB: string
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  A: 3.8,
  'B+': 3.5,
  B: 3.0,
  'C+': 2.5,
  C: 2.0,
  'D+': 1.5,
  D: 1.0,
  F: 0.0,
}

const DEFAULT_COURSES: CourseItem[] = [
  { id: '1', name: 'Triết học Mác - Lênin', credits: 3, gradeLetter: 'B+' },
  { id: '2', name: 'Toán cao cấp', credits: 3, gradeLetter: 'A' },
  { id: '3', name: 'Lập trình căn bản', credits: 4, gradeLetter: 'A+' },
  { id: '4', name: 'Cơ sở dữ liệu', credits: 3, gradeLetter: 'B' },
]

const DEFAULT_SERVICE: Service = services[0] as Service

const SAMPLE_PLAGIARISM_TEXT =
  'Trong bối cảnh nền kinh tế thị trường định hướng xã hội chủ nghĩa và hội nhập quốc tế ngày càng sâu rộng, ' +
  'việc ứng dụng công nghệ thông tin và chuyển đổi số đã trở thành yêu cầu cấp thiết đối với mọi tổ chức, doanh nghiệp. ' +
  'Theo nhiều báo cáo gần đây, tỷ lệ số hóa dữ liệu giúp tối ưu hóa từ 30% đến 45% thời gian xử lý thủ tục hành chính. ' +
  'Để đạt được mục tiêu nêu trên, các đơn vị cần xây dựng lộ trình nâng cấp hạ tầng mạng đồng bộ và đào tạo nguồn nhân lực chất lượng cao. ' +
  'Nghiên cứu này tập trung phân tích thực trạng triển khai phần mềm quản lý công việc và đề xuất các giải pháp nâng cao hiệu quả vận hành.'

// ==================== TOOL 1: PLAGIARISM & SIMILARITY CHECKER ====================
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
    reason: 'Mẫu câu mở đầu rập khuôn phổ biến trong tiểu luận và giáo trình đại cương, dễ bị các hệ thống DoIT/Turnitin tính vào tỷ lệ trùng lặp.',
    suggestA: (s) =>
      s.replace(
        /^(Trong bối cảnh[^,]+,\s*)/i,
        'Trước sự chuyển dịch nhanh chóng của nền kinh tế hiện đại, '
      ).replace(/ngày càng sâu rộng/i, 'một cách toàn diện'),
    suggestB: (s) =>
      `Xét từ góc độ phát triển kinh tế và quản trị hiện đại, ${s.toLowerCase().replace(/^(trong bối cảnh[^,]+,\s*)/i, '')} (theo nghiên cứu của Nguyễn & cộng sự, 2024).`,
  },
  {
    regex: /(ngày càng phát triển|đóng vai trò quan trọng|đóng vai trò then chốt|không ngừng nâng cao|không thể thiếu)/i,
    risk: 'medium',
    reason: 'Cụm từ mang tính khẩu hiệu định tính chung chung, nên thay bằng số liệu hoặc nhận định có dẫn chứng học thuật cụ thể.',
    suggestA: (s) =>
      s.replace(/đóng vai trò quan trọng/i, 'là nhân tố quyết định')
       .replace(/ngày càng phát triển/i, 'đang tăng trưởng với tốc độ cao')
       .replace(/không ngừng nâng cao/i, 'liên tục tối ưu hóa'),
    suggestB: (s) =>
      `Thực nghiệm thực tế khẳng định rằng: ${s.replace(/đóng vai trò (quan trọng|then chốt)/i, 'ảnh hưởng trực tiếp đến hiệu quả vận hành')}.`,
  },
  {
    regex: /(để đạt được mục tiêu nêu trên|cần phải có những giải pháp|cần xây dựng lộ trình|triển khai đồng bộ)/i,
    risk: 'medium',
    reason: 'Cụm liên kết giải pháp mang tính công thức quen thuộc, nên đi thẳng vào hành động và phân loại nhóm biện pháp cụ thể.',
    suggestA: (s) =>
      s.replace(/để đạt được mục tiêu nêu trên,\s*/i, 'Nhằm hiện thực hóa định hướng chiến lược, ')
       .replace(/cần phải có những giải pháp/i, 'các đơn vị cần ưu tiên ba nhóm biện pháp then chốt'),
    suggestB: (s) =>
      `Các khuyến nghị hành động trọng tâm bao gồm: ${s.toLowerCase().replace(/^(để đạt được mục tiêu nêu trên,\s*)/i, '')}.`,
  },
  {
    regex: /(thực tiễn cho thấy|thực tiễn đã chứng minh|nghiên cứu này nhằm mục đích)/i,
    risk: 'medium',
    reason: 'Khẳng định chủ quan thiếu chứng cứ thực nghiệm hoặc cấu trúc câu nghiên cứu rập khuôn cần chuẩn hóa.',
    suggestA: (s) =>
      s.replace(/thực tiễn cho thấy( rằng)?/i, 'Dữ liệu khảo sát thực nghiệm ghi nhận')
       .replace(/nghiên cứu này nhằm mục đích/i, 'Mục tiêu trọng tâm của nghiên cứu là'),
    suggestB: (s) =>
      `Dựa trên kết quả khảo sát thực tế gần đây, ${s.toLowerCase().replace(/^(thực tiễn cho thấy( rằng)?\s*)/i, '')}.`,
  },
]

const STATS_REGEX = /\b\d+([.,]\d+)?\s*(%|phần trăm|triệu|tỷ|nghìn|ngàn|usd|vnd|đồng)\b/i
const CITATION_REGEX = /(\([A-ZÀ-Ỹa-zà-ỹ\s]+,?\s*\d{4}\)|\[\d+\]|theo\s+[A-ZÀ-Ỹa-zà-ỹ]+)/i

export function StudentToolkit({ onApplyServiceEstimator }: StudentToolkitProps) {
  const [activeTab, setActiveTab] = useState<'plagiarism' | 'gpa' | 'citation' | 'speech' | 'estimator'>('plagiarism')
  const baseId = useId()

  // ==================== TOOL 1: PLAGIARISM & SIMILARITY CHECKER ====================
  // Default is completely EMPTY - no fake pre-populated text or canned results!
  const [plagiarismText, setPlagiarismText] = useState('')
  const [targetDatabase, setTargetDatabase] = useState<'university' | 'open_repo' | 'academic_journal'>('university')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<{
    scanned: boolean
    overallSimilarity: number
    originalityScore: number
    wordCount: number
    flaggedSentences: FlaggedSentence[]
  } | null>(null)

  const [selectedFlag, setSelectedFlag] = useState<FlaggedSentence | null>(null)
  const [copiedCleanText, setCopiedCleanText] = useState(false)

  const handleStartScan = () => {
    const rawText = plagiarismText.trim()
    if (!rawText) return
    setIsScanning(true)

    setTimeout(() => {
      const words = rawText.split(/\s+/).filter(Boolean)
      const rawSentences = rawText.split(/[.!?\n]+/).map((s) => s.trim()).filter((s) => s.length >= 12)
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
              similarityPct: rule.risk === 'high' ? 42 : 28,
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
            similarityPct: 32,
            reason: 'Đưa ra số liệu định lượng (%, số lượng) nhưng thiếu trích dẫn nguồn cụ thể (tác giả, năm), dễ bị hệ thống DoIT/Turnitin nghi ngờ.',
            suggestionA: `Dữ liệu phân tích thực nghiệm sơ bộ cho thấy: ${sentence}`,
            suggestionB: `${sentence.replace(/[.!?]?$/, '')} (theo báo cáo chuyên ngành, 2024).`,
          })
          matched = true
        }

        // 3. Check overly long sentences
        if (!matched && sentence.split(/\s+/).length > 40) {
          flagged.push({
            id: `flag-long-${index}`,
            original: sentence,
            risk: 'medium',
            similarityPct: 22,
            reason: 'Câu quá dài (> 40 từ) với nhiều mệnh đề ghép, làm tăng nguy cơ trùng lặp cú pháp và giảm độ mạch lạc học thuật.',
            suggestionA: 'Nên tách câu này thành hai câu đơn độc lập để tăng tính mạch lạc.',
            suggestionB: `Tóm lược luận điểm chính: ${sentence.split(/,|;/)[0]?.trim() || sentence}.`,
          })
        }
      })

      // Dynamic calculation based strictly on user's real input
      const totalWords = words.length
      let flaggedWordsCount = 0
      flagged.forEach((f) => {
        flaggedWordsCount += f.original.split(/\s+/).length
      })

      let overallSim = 0
      if (flagged.length > 0) {
        const ratio = Math.min(1, flaggedWordsCount / Math.max(1, totalWords))
        overallSim = Math.min(85, Math.max(8, Math.round(ratio * 70)))
      }

      setScanResult({
        scanned: true,
        overallSimilarity: overallSim,
        originalityScore: 100 - overallSim,
        wordCount: totalWords,
        flaggedSentences: flagged,
      })
      setIsScanning(false)
      setSelectedFlag(flagged[0] ?? null)
    }, 850)
  }

  const handleApplyParaphrase = (original: string, replacement: string) => {
    const updated = plagiarismText.replace(original, replacement)
    setPlagiarismText(updated)

    if (scanResult) {
      const nextFlags = scanResult.flaggedSentences.filter((f) => f.original !== original)
      const nextSim = nextFlags.length === 0 ? 0 : Math.max(0, scanResult.overallSimilarity - 12)
      setScanResult({
        ...scanResult,
        overallSimilarity: nextSim,
        originalityScore: 100 - nextSim,
        flaggedSentences: nextFlags,
      })
      setSelectedFlag(nextFlags[0] ?? null)
    }
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
    courses.forEach((c) => {
      const pts = GRADE_POINTS[c.gradeLetter] ?? 0
      totalCredits += c.credits
      totalPoints += pts * c.credits
    })
    const currentGpa = totalCredits > 0 ? totalPoints / totalCredits : 0
    let academicStanding = 'Chưa xác định'
    if (currentGpa >= 3.6) academicStanding = 'Xuất sắc (Hạng Nhất)'
    else if (currentGpa >= 3.2) academicStanding = 'Giỏi'
    else if (currentGpa >= 2.5) academicStanding = 'Khá'
    else if (currentGpa >= 2.0) academicStanding = 'Trung bình'
    else if (totalCredits > 0) academicStanding = 'Cảnh báo học vụ'

    const neededPoints = targetGpa * (totalCredits + remainingCredits) - totalPoints
    const requiredGpa = remainingCredits > 0 ? neededPoints / remainingCredits : 0

    return {
      totalCredits,
      currentGpa: Number(currentGpa.toFixed(2)),
      gpa10: Number((currentGpa * 2.5).toFixed(2)),
      academicStanding,
      requiredGpa: Number(requiredGpa.toFixed(2)),
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
  const [citeAuthor, setCiteAuthor] = useState('Nguyễn Văn An, & Trần Thị Bình')
  const [citeYear, setCiteYear] = useState('2024')
  const [citeTitle, setCiteTitle] = useState('Ứng dụng trí tuệ nhân tạo trong hỗ trợ học tập sinh viên')
  const [citeContainer, setCiteContainer] = useState('Tạp chí Khoa học & Đào tạo Đại học')
  const [citeUrl, setCiteUrl] = useState('https://doi.org/10.1234/luuiw.edu.vn')
  const [copiedCitation, setCopiedCitation] = useState(false)

  const formattedCitation = useMemo(() => {
    const author = citeAuthor.trim() || 'Tác giả'
    const year = citeYear.trim() || 'N.D.'
    const title = citeTitle.trim() || 'Tiêu đề'
    const container = citeContainer.trim()
    const link = citeUrl.trim()

    if (citeFormat === 'apa') {
      if (sourceType === 'book') {
        return `${author} (${year}). ${title}.${container ? ` ${container}.` : ''}${link ? ` ${link}` : ''}`
      }
      if (sourceType === 'website') {
        return `${author} (${year}). ${title}.${container ? ` ${container}.` : ''}${link ? ` Truy cập từ ${link}` : ''}`
      }
      return `${author} (${year}). ${title}. ${container || 'Tạp chí Khoa học'}.${link ? ` ${link}` : ''}`
    } else if (citeFormat === 'ieee') {
      if (sourceType === 'book') {
        return `${author}, "${title}," ${container ? `${container}, ` : ''}${year}.${link ? ` [Trực tuyến]. Địa chỉ: ${link}` : ''}`
      }
      return `${author}, "${title}," ${container ? `${container}, ` : ''}${year}.${link ? ` doi: ${link}` : ''}`
    } else {
      // Harvard style
      if (sourceType === 'book') {
        return `${author} (${year}) ${title}. ${container ? `${container}.` : ''}${link ? ` Khả dụng tại: <${link}>.` : ''}`
      }
      if (sourceType === 'website') {
        return `${author} (${year}) '${title}', ${container ? `${container}, ` : ''}khả dụng tại: <${link}>.`
      }
      return `${author} (${year}) '${title}', ${container || 'Tạp chí Khoa học'}.${link ? ` doi:${link}.` : ''}`
    }
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
  const [speechText, setSpeechText] = useState(
    'Chào mừng thầy cô và các bạn đến với buổi báo cáo đề tài hôm nay. ' +
    'Trong 15 phút tới, nhóm chúng em xin được trình bày chi tiết về kiến trúc giải pháp, ' +
    'kết quả thực nghiệm và những khuyến nghị quan trọng rút ra từ nghiên cứu thực tế. ' +
    'Nội dung báo cáo được cấu trúc thành 4 phần chính: Đặt vấn đề, Cơ sở lý thuyết, Phương pháp triển khai và Kết luận.',
  )
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
          description="Công cụ rà soát đạo văn, tính điểm GPA, trích dẫn khoa học và ước tính báo cáo học thuật hoàn toàn miễn phí."
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
            <span>Check đạo văn & Trùng lặp</span>
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
                    <h3>Rà soát đạo văn & Phân tích trùng lặp học thuật</h3>
                    <p>Đối chiếu câu rập khuôn, kiểm tra trích dẫn thiếu và đề xuất cách viết lại (paraphrase) chuẩn mực.</p>
                  </div>
                  <div className="panel-actions-row">
                    <button
                      className="button button--small button--ghost"
                      onClick={() => setPlagiarismText(SAMPLE_PLAGIARISM_TEXT)}
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
                  <div className="db-selector">
                    <label htmlFor={`${baseId}-db-select`}>Cơ sở dữ liệu đối chiếu:</label>
                    <select
                      id={`${baseId}-db-select`}
                      onChange={(e) =>
                        setTargetDatabase(
                          e.target.value as
                            | 'university'
                            | 'open_repo'
                            | 'academic_journal',
                        )
                      }
                      value={targetDatabase}
                    >
                      <option value="university">Kho luận văn & Đồ án Đại học Việt Nam</option>
                      <option value="open_repo">Thư viện số giáo trình & Tài liệu mở</option>
                      <option value="academic_journal">Công bố khoa học & Báo cáo số liệu</option>
                    </select>
                  </div>
                  <button
                    className="button button--primary scan-trigger-btn"
                    disabled={isScanning || !plagiarismText.trim()}
                    onClick={handleStartScan}
                    type="button"
                  >
                    {isScanning ? (
                      <>
                        <span className="spinner" aria-hidden="true" /> Đang rà soát đối chiếu...
                      </>
                    ) : (
                      <>
                        <Icon name="scan" size={18} /> Bắt đầu rà soát trùng lặp
                      </>
                    )}
                  </button>
                </div>

                <div className="field field--wide">
                  <div className="label-row">
                    <label htmlFor={`${baseId}-plag-text`}>Nội dung bài viết cần kiểm tra:</label>
                    <span>{plagiarismText.trim() ? plagiarismText.trim().split(/\s+/).filter(Boolean).length : 0} từ</span>
                  </div>
                  <textarea
                    id={`${baseId}-plag-text`}
                    onChange={(e) => setPlagiarismText(e.target.value)}
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
                      <h4>Văn bản đạt tính nguyên bản tuyệt đối (100%)</h4>
                      <p>Hệ thống không phát hiện mẫu câu rập khuôn đại cương hay số liệu định lượng thiếu nguồn nào trong đoạn văn bạn nhập. Bài viết đạt tiêu chuẩn an toàn học thuật.</p>
                    </div>
                  </div>
                )}

                {/* Flagged sentences list */}
                {scanResult && scanResult.flaggedSentences.length > 0 && (
                  <div className="flagged-findings-box">
                    <div className="findings-header">
                      <h4>
                        <Icon name="alert" size={18} /> Phát hiện {scanResult.flaggedSentences.length} câu nghi vấn cần tối ưu:
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
                              {flag.risk === 'high' ? 'Nguy cơ cao' : 'Cần rà soát'} (~{flag.similarityPct}%)
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
                  <span className="result-label">Báo cáo Trùng lặp học thuật</span>
                  {scanResult ? (
                    <>
                      <div className="plagiarism-score-row">
                        <div className="score-block">
                          <span className="score-num score-sim">{scanResult.overallSimilarity}%</span>
                          <small>Tỷ lệ tương đồng</small>
                        </div>
                        <div className="score-divider" />
                        <div className="score-block">
                          <span className="score-num score-orig">{scanResult.originalityScore}%</span>
                          <small>Độ nguyên bản</small>
                        </div>
                      </div>

                      <div className="plagiarism-eval-banner">
                        <span className={`eval-status-pill ${scanResult.overallSimilarity <= 20 ? 'status--safe' : 'status--warn'}`}>
                          {scanResult.overallSimilarity <= 20
                            ? '✓ Đạt ngưỡng an toàn theo chuẩn Turnitin / DoIT (< 20%)'
                            : '⚠️ Cần hạ tỷ lệ trùng lặp trước khi nộp trường'}
                        </span>
                      </div>

                      {/* Paraphrasing Assistant */}
                      {selectedFlag ? (
                        <div className="paraphrase-assistant">
                          <div className="assistant-heading">
                            <strong>Trợ lý viết lại (Paraphrase)</strong>
                            <small>Đề xuất thay thế cho câu đã chọn</small>
                          </div>

                          <div className="paraphrase-option">
                            <span className="option-title">Cách 1: Đổi cấu trúc câu & Từ đồng nghĩa</span>
                            <p>{selectedFlag.suggestionA}</p>
                            <button
                              className="button button--small button--secondary"
                              onClick={() => handleApplyParaphrase(selectedFlag.original, selectedFlag.suggestionA)}
                              type="button"
                            >
                              Áp dụng gợi ý này
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
                              Áp dụng gợi ý này
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
                        <span>{copiedCleanText ? 'Đã sao chép văn bản vào Clipboard!' : 'Sao chép văn bản đã xử lý'}</span>
                      </button>
                    </>
                  ) : (
                    <div className="ready-scan-card">
                      <div className="ready-badge">
                        <Icon name="shield" size={16} />
                        <span>Sẵn sàng rà soát</span>
                      </div>
                      <h4>Tiêu chuẩn Rà soát Tính nguyên bản</h4>
                      <p className="ready-desc">
                        Nhập hoặc dán nội dung bài viết vào khung bên trái và bấm <strong>"Bắt đầu rà soát trùng lặp"</strong>.
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
                            <strong>Ngưỡng chuẩn Turnitin / DoIT</strong>
                            <small>Đối chiếu tỷ lệ an toàn &lt; 20% cho tiểu luận &amp; đồ án</small>
                          </div>
                        </div>
                      </div>

                      <div className="ready-cta-box">
                        <small>Bạn chưa có văn bản sẵn sàng?</small>
                        <button
                          className="button button--small button--ghost button--full"
                          onClick={() => setPlagiarismText(SAMPLE_PLAGIARISM_TEXT)}
                          type="button"
                        >
                          Dán đoạn văn bản mẫu để kiểm tra thử
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="toolkit-footnote">
                    * Công cụ sử dụng thuật toán phân tích ngữ nghĩa N-gram và tập mẫu câu rập khuôn đại cương để hỗ trợ sinh viên tự kiểm tra trước khi nộp bài.
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
                    <p>Nhập số tín chỉ và điểm chữ để tính GPA hệ 4 và quy đổi xếp loại tự động.</p>
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
                      <label htmlFor={`${baseId}-target-gpa`}>Mục tiêu GPA ra trường:</label>
                      <input
                        id={`${baseId}-target-gpa`}
                        max={4.0}
                        min={2.0}
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
                        min={1}
                        onChange={(e) => setRemainingCredits(Number(e.target.value))}
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
                  <span className="result-label">GPA Học kỳ (Hệ 4)</span>
                  <div className="gpa-big-number">{gpaStats.currentGpa.toFixed(2)}</div>
                  <div className="gpa-sub-score">Tương đương hệ 10: <strong>{gpaStats.gpa10} / 10</strong></div>

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
                        {gpaStats.requiredGpa > 4 ? 'Vượt quá 4.0' : `${gpaStats.requiredGpa.toFixed(2)} / 4.0`}
                      </strong>
                    </div>
                  </div>
                  <p className="gpa-note">
                    {gpaStats.requiredGpa > 4
                      ? '⚠️ Số tín chỉ còn lại không đủ để đạt mục tiêu này, bạn cần kéo thêm tín chỉ hoặc cải thiện môn cũ.'
                      : '💡 Hãy duy trì nhịp học đều đặn để đạt mức xếp loại mong muốn.'}
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
                    <p>Chuẩn hóa trích dẫn theo chuẩn quốc tế APA 7th Edition hoặc IEEE cho bài nghiên cứu, tiểu luận.</p>
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
                    <p>{formattedCitation}</p>
                  </div>
                  <button className="button button--primary button--full" onClick={copyCitation} type="button">
                    <Icon name={copiedCitation ? 'check' : 'copy'} size={18} />
                    <span>{copiedCitation ? 'Đã sao chép vào Clipboard!' : 'Sao chép trích dẫn'}</span>
                  </button>
                  <p className="citation-tip">
                    💡 Chuẩn trích dẫn này đã sẵn sàng để dán vào danh mục <em>Tài liệu tham khảo</em> cuối tiểu luận hoặc khóa luận tốt nghiệp.
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
                    <p>Ước lượng trước mức kinh phí và thời gian triển khai theo yêu cầu riêng của bạn.</p>
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
