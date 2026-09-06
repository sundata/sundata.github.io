import { useEffect } from "react";

// Components that already expose Japanese/English copy render their English branch
// for Chinese, then this small presentation layer supplies the third locale. Keeping
// the map here also makes missing Chinese strings easy to find and test.
const zh = new Map(Object.entries({
  "Tools": "工具",
  "ID photo": "证件照",
  "IT & Work": "IT 与工作",
  "Feedback": "建议反馈",
  "Source": "开发支持",
  "Free · No account · Files stay on your device": "免费 · 无需注册 · 文件仅在设备内处理",
  "Everyday file tools, all in one place.": "日常文件工具，一站完成。",
  "Edit images, PDFs and ID photos securely in your browser. Nothing is uploaded to a server.": "在浏览器中安全编辑图片、PDF 和证件照，文件不会上传到服务器。",
  "Create ID photo": "制作证件照",
  "Passport, résumé and visa sizes": "支持护照、简历和签证等常用尺寸",
  "Compress & convert images": "压缩与转换图片",
  "Compress PDF": "压缩 PDF",
  "Make PDFs easier to share": "缩小文件，分享更方便",
  "Images to PDF": "图片转 PDF",
  "Combine images into one PDF": "将多张图片合并为一个 PDF",
  "Merge PDFs": "合并 PDF",
  "Combine files in your chosen order": "按照选择顺序合并多个文件",
  "Extract PDF pages": "提取 PDF 页面",
  "Save only the pages you need": "仅保存需要的页面",
  "Organize PDF pages": "整理 PDF 页面",
  "Reorder and remove unwanted pages": "重新排序并删除不需要的页面",
  "Create QR code": "制作二维码",
  "Create a PNG from a URL or text": "通过网址或文字生成 PNG",
  "Developer tools": "开发者工具",
  "JSON, Base64, UUID and timestamps": "JSON、Base64、UUID 与时间戳",
  "Check business numbers": "查询企业编号",
  "Corporate and invoice number formats": "检查法人编号与发票登记编号格式",
  "Tax-risk self-check": "税务风险简易检查",
  "Review books, evidence and deadlines": "整理账簿、凭证和期限风险",
  "Suggest a tool": "建议新工具",
  "Request features or report friction": "提交功能需求或使用不便",
  "Free photo utilities": "免费图片工具",
  "No uploads. Everything runs on your device.": "无需上传，所有处理均在设备内完成。",
  "Compress & convert image": "压缩与转换图片",
  "Choose image": "选择图片",
  "Quality": "画质",
  "Width": "宽度",
  "Height": "高度",
  "Format": "格式化",
  "Convert & download": "转换并下载",
  "Original": "原始大小",
  "Estimated": "转换后预计",
  "Width (mm)": "宽度（mm）",
  "Height (mm)": "高度（mm）",
  "Required pixels": "所需像素",
  "Reset": "重置",
  "mm · px · DPI calculator": "mm、px 与 DPI 计算器",
  "Format & validate": "格式化与验证",
  "Input": "输入",
  "Result": "结果",
  "Minify": "压缩",
  "Copy": "复制",
  "Copied": "已复制",
  "Text": "文字",
  "Encode": "编码",
  "Decode": "解码",
  "UUID & timestamp": "UUID 与时间戳",
  "New": "重新生成",
  "Enter a valid value": "请输入有效数值",
  "Corporate & invoice number check": "法人编号与发票登记编号检查",
  "13-digit corporate number or T + 13 digits": "13 位法人编号或 T＋13 位登记编号",
  "Enter a number to check its format.": "输入编号后即可检查格式。",
  "Length or check digit does not match.": "位数或校验位不正确。",
  "The 13 digits and check digit are valid.": "13 位数字及校验位有效。",
  "Format alone does not prove existence or registration. Confirm with the NTA.": "格式正确不代表企业真实存在或已登记，请在日本国税厅网站最终确认。",
  "Corporate registry": "法人编号公示网站",
  "Invoice registry": "发票登记编号公示网站",
  "An organization checklist—not tax advice or an audit prediction.": "本功能仅用于整理风险，不构成税务建议或税务调查预测。",
  "NTA tax information": "日本国税厅税务信息",
  "IT & work utilities": "IT 与工作实用工具",
  "Paste, check and use. Your input stays in this browser.": "粘贴、检查、立即使用；输入内容只在当前浏览器内处理。",
  "Developer & data": "开发与数据",
  "For businesses in Japan": "面向日本企业",
  "Comment on this tool": "评论这个工具",
  "Nice": "好用",
  "Okay": "一般",
  "Annoying": "不好用",
  "All visitors": "全部访客",
  "Count unavailable": "暂时无法读取计数",
  "Help shape the next useful tool.": "一起打造下一个实用工具。",
  "Tell us what you need, what felt awkward, or what should work better. Track public requests on GitHub, or email us without an account.": "告诉我们你需要什么、哪里不好用、希望怎样改进。可以在 GitHub 公开跟进，也可无需账号直接发邮件。",
  "Nothing sent before you submit": "提交前不会发送到外部",
  "Small ideas are welcome": "简短建议也很欢迎",
  "Type": "类型",
  "Tool request": "想要的工具",
  "Usability issue": "使用不便",
  "Other idea": "其他建议",
  "Title": "标题",
  "Tell us more": "请详细说明",
  "Send email": "发送邮件",
  "Copy text": "复制内容",
  "Buy small. Start building fast.": "低价购买，快速开始开发。",
  "Affordable source code for selected tools and apps—ready for learning, personal work and business prototypes.": "以实惠价格提供部分工具和 App 源代码，可用于学习、个人制作和商业原型。",
  "Copyright remains with SunData. Reselling or redistributing the purchased source itself is not allowed.": "著作权归 SunData 所有，不得转售或再次分发所购买的源代码本身。",
  "Visit shop & support": "查看销售与支持页面",
  "Ask about a license": "咨询购买与定制",
  "Your files never leave your device.": "文件不会离开你的设备。",
  "Image and PDF processing stays in your browser and is never uploaded or stored. Only anonymous reaction totals are saved; they are never linked to your files or inputs.": "图片和 PDF 只在浏览器内处理，不会上传或保存。仅匿名保存评价汇总，且不会与文件或输入内容关联。",
  "Built to stay free": "为了持续免费",
  "What’s new": "更新记录",
  "This site runs without ads or paid downloads. Choose any way you’d like to help.": "本站不设广告和付费下载，欢迎选择喜欢的方式支持我们。",
  "Support free tools": "支持免费工具",
  "Free, ad-free and privacy-first.": "免费、无广告、重视隐私",
  "Your support helps cover hosting, improve features, and keep high-quality downloads free for everyone.": "你的支持将用于服务器运营和功能改进，让所有人都能继续免费下载高质量文件。",
  "Support this free tool": "支持免费工具",
  "International support": "海外支持",
  "You will continue to a secure external payment service.": "即将前往安全的外部支付服务。",
  "Terms": "使用条款"
  ,"On-device": "设备内处理"
  ,"Recommended 300 dpi": "推荐 300 dpi"
  ,"Take a photo": "拍摄照片"
  ,"Remove everything except person": "自动移除人物以外的背景"
  ,"Erase manually without AI": "不使用 AI，手动擦除"
  ,"Transparent": "透明"
  ,"Pure white": "纯白"
  ,"Off-white": "米白"
  ,"Light gray": "浅灰"
  ,"Pale blue": "浅蓝"
  ,"ID blue": "证件照蓝"
  ,"Blue": "蓝色"
  ,"ID red": "证件照红"
  ,"Dark red": "深红"
  ,"Neutral": "中性灰"
  ,"PDF & file tools": "PDF 与文件工具"
  ,"Nothing is uploaded. Processing stays on this device.": "文件不会上传，所有处理均在当前设备内完成。"
  ,"Optimize every page into a PDF that's easier to share.": "优化每一页，生成更便于分享的 PDF。"
  ,"Choose a PDF file · or drop it here": "选择 PDF 文件 · 或拖放到这里"
  ,"Compression level": "压缩级别"
  ,"Recommended": "推荐"
  ,"Smaller": "较小"
  ,"Smallest": "最小"
  ,"Compressed": "压缩后"
  ,"Text is rasterized during compression and may no longer be searchable or selectable.": "压缩时文字会被栅格化，之后可能无法搜索或选择。"
  ,"Compress & download": "压缩并下载"
  ,"Combine multiple images into one PDF in the order selected.": "按照选择顺序将多张图片合并为一个 PDF。"
  ,"Choose images (multiple) · or drop it here": "选择多张图片 · 或拖放到这里"
  ,"Create & download PDF": "生成并下载 PDF"
  ,"Combine multiple PDFs into one in the order selected.": "按照选择顺序将多个 PDF 合并为一个文件。"
  ,"Choose PDFs (multiple) · or drop it here": "选择多个 PDF · 或拖放到这里"
  ,"Merge & download": "合并并下载"
  ,"Save only the pages you need as a new PDF.": "仅将需要的页面保存为新的 PDF。"
  ,"Pages to extract": "需要提取的页面"
  ,"Extract & download": "提取并下载"
  ,"Reorder pages or remove unwanted ones by entering the desired order.": "输入所需顺序，重新排列页面或删除不需要的页面。"
  ,"New page order": "新的页面顺序"
  ,"Save organized PDF": "保存整理后的 PDF"
  ,"Example: 1, 3-5, 8": "示例：1, 3-5, 8"
  ,"Example: 3, 1, 2, 5-8": "示例：3, 1, 2, 5-8"
  ,"Create a QR code": "制作二维码"
  ,"Turn a URL or short text into a QR code. Your input is never sent anywhere.": "将网址或短文字生成二维码，输入内容不会发送到外部。"
  ,"URL or text": "网址或文字"
  ,"Image size": "图片尺寸"
  ,"Your QR code will appear here": "生成的二维码将显示在这里"
  ,"Generated in your browser": "在浏览器内生成"
  ,"Download PNG": "下载 PNG"
  ,"Sales, deposits and books do not reconcile": "销售额、收款与账簿记录不一致"
  ,"Personal and business expenses are mixed": "个人支出与经营费用混在一起"
  ,"Receipts or invoices are missing/incomplete": "收据或发票缺失、填写不完整"
  ,"Tax deadlines may be missed": "税务期限管理存在遗漏风险"
  ,"Cash transactions or director loans are frequent": "现金交易或董事借款较多"
  ,"Contractor fees and payroll may be misclassified": "外包费用与工资的分类可能不清楚"
  ,"Supplier invoice status is not checked": "尚未确认交易方的发票登记状态"
  ,"Electronic records lack a retention rule": "电子交易数据没有保存规则"
  ,"No warning items selected.": "尚未选择任何风险项目。"
  ,"Review recommended: reconcile records monthly.": "建议确认：请每月核对凭证与账簿。"
  ,"Act soon: review the details with a tax professional or tax office.": "建议尽快整理，并向税务师或税务机关确认。"
  ,"e.g. Add an image blur tool": "例如：希望增加图片打码工具"
  ,"What are you trying to do, and what was inconvenient?": "请说明你想完成什么，以及哪里使用不便。"
  ,"Enter at least 3 characters for the title and 10 for details.": "标题至少填写 3 个字，详细说明至少填写 10 个字。"
  ,"Personal license": "个人许可"
  ,"Commercial license": "商业许可"
  ,"Customization": "定制开发"
  ,"from ¥980": "¥980 起"
  ,"from ¥2,980": "¥2,980 起"
  ,"Quote": "报价"
  ,"Learning and personal projects": "学习与个人项目"
  ,"Complete source code": "完整源代码"
  ,"Setup guide": "安装说明"
  ,"One commercial project": "一个商业项目"
  ,"Branding changes allowed": "可修改品牌与文案"
  ,"Discounted updates": "后续版本优惠更新"
  ,"Features and design changes": "功能增加与设计调整"
  ,"Launch support": "发布与申请支持"
  ,"Japanese and Chinese support": "支持日文和中文"
  ,"POPULAR": "推荐"
  ,"Each listing will clearly state requirements, included files, license and update terms. Delivery uses a private download or limited GitHub repository.": "每个商品页面都会注明运行环境、所含文件、许可和更新条件。付款后通过私密下载或限定 GitHub 仓库交付。"
  ,"Share this free tool": "分享免费工具"
  ,"Help someone who needs a simple file tool": "分享给需要简单文件工具的人"
  ,"Supported photo sizes": "支持的证件照尺寸"
  ,"Choose a use and the correct aspect ratio is applied.": "选择用途后会自动设置正确的长宽比例。"
  ,"SunData Tools is a collection of tools for ID photos, images and PDFs—without user registration, watermarks or paid downloads. Files are processed in your browser and never sent to our server.": "SunData Tools 提供证件照、图片和 PDF 等日常工具，无需注册、没有水印，也不收取下载费用。文件只在浏览器中处理，不会发送到服务器。"
  ,"PDF compression, merge, page organization, QR creation and tool home": "PDF 压缩、合并、页面整理、二维码和工具首页"
  ,"Global sizes, background removal and manual eraser": "全球证件照尺寸、背景移除和手动橡皮擦"
  ,"Compression, format conversion and DPI calculator": "图片压缩、格式转换和 DPI 计算器"
  ,"PWA, offline support and SEO guides": "PWA、离线支持和 SEO 指南"
  ,"© 2026 SunData Tools. Made with care in Japan.": "© 2026 SunData Tools，用心制作于日本。"
}));

function translateNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const original = node.nodeValue;
    const trimmed = original.trim();
    const translated = zh.get(trimmed);
    if (translated) node.nodeValue = original.replace(trimmed, translated);
    return;
  }
  if (!(node instanceof Element) || ["SCRIPT", "STYLE"].includes(node.tagName)) return;
  for (const attr of ["placeholder", "aria-label", "title"]) {
    const value = node.getAttribute(attr);
    if (value && zh.has(value)) node.setAttribute(attr, zh.get(value));
  }
  node.childNodes.forEach(translateNode);
}

export function useChinesePageTranslation(lang) {
  useEffect(() => {
    if (lang !== "zh") return undefined;
    translateNode(document.body);
    const observer = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(translateNode));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [lang]);
}
