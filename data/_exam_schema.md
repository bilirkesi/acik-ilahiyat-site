# Sınav JSON şeması (vize / final / yaz-kursu)

Konum: `data/<ders-slug>/exams/{vize,final,yaz-kursu}.json`

```json
{
  "id": "vize",
  "type": "vize",
  "title": "Vize Sınavı",
  "description": "Dönem ortası testi.",
  "exam_window": "midterm",
  "pass_mark": 0.7,
  "questions": [
    {
      "question": "Soru metni?",
      "answerOptions": [
        {
          "text": "A şıkkı",
          "isCorrect": true,
          "rationale": "Neden doğru (kısa)"
        },
        {
          "text": "B şıkkı",
          "isCorrect": false,
          "rationale": "Neden yanlış (opsiyonel)"
        }
      ],
      "solution": "Adım adım çözüm (markdown olabilir).",
      "hint": "İpucu",
      "type": "test",
      "points": 1,
      "tags": ["bölüm-1", "mezhep"]
    }
  ]
}
```

## Alanlar

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| `questions[].question` | evet | Soru metni |
| `questions[].answerOptions[].text` | evet | Şık metni |
| `questions[].answerOptions[].isCorrect` | evet | Doğru cevap |
| `questions[].answerOptions[].rationale` | hayır | Şık gerekçesi |
| `questions[].solution` | hayır | Tam çözüm (OKF'de `### Çözüm`) |
| `questions[].hint` | hayır | İpucu |
| `questions[].points` | hayır | Puan |
| `questions[].tags` | hayır | Bölüm/kavram etiketleri |

OKF export: `okf/courses/<slug>/exams/<id>.md` (`type: Exam`, `exam_window: midterm|final|summer`).
