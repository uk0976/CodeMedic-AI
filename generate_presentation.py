import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor
from PIL import Image, ImageDraw, ImageFont

# Define Color Palette
BG_DARK = RGBColor(11, 15, 25)         # #0B0F19 Deep Obsidian
CARD_BG = RGBColor(19, 28, 49)        # #131C31 Dark Slate Card
CARD_BG_ALT = RGBColor(15, 23, 42)    # #0F172A Card Alt
PRIMARY_BLUE = RGBColor(37, 99, 235)  # #2563EB
CYAN = RGBColor(6, 182, 212)          # #06B6D4
SKY_BLUE = RGBColor(56, 189, 248)     # #38BDF8
PURPLE = RGBColor(124, 58, 237)       # #7C3AED
AMBER = RGBColor(245, 158, 11)        # #F59E0B
GREEN = RGBColor(52, 211, 153)        # #34D399
RED = RGBColor(248, 113, 113)         # #F87171

TEXT_WHITE = RGBColor(248, 250, 252)  # #F8FAFC
TEXT_MUTED = RGBColor(148, 163, 184)  # #94A3B8
TEXT_DIM = RGBColor(100, 116, 139)    # #64748B
BORDER_GLOW = RGBColor(30, 58, 138)   # #1E3A8A Dark Blue Border

FONT_TITLE = "Segoe UI"
FONT_BODY = "Segoe UI"

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # Blank slide layout

    # Helper: Set background color
    def set_bg(slide):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = BG_DARK

    # Helper: Add Header
    def add_header(slide, badge_text, title_text, subtitle_text=""):
        # Category Badge
        badge_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(8.0), Inches(0.4))
        tf = badge_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = badge_text.upper()
        p.font.name = FONT_TITLE
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = CYAN

        # Main Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.78), Inches(0.7), Inches(10.0), Inches(0.7))
        tf = title_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.name = FONT_TITLE
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE

        # Subtitle if present
        if subtitle_text:
            sub_box = slide.shapes.add_textbox(Inches(0.78), Inches(1.35), Inches(11.0), Inches(0.4))
            tf = sub_box.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.text = subtitle_text
            p.font.name = FONT_BODY
            p.font.size = Pt(13)
            p.font.color.rgb = TEXT_MUTED

    # Helper: Add Animation Suggestion Badge
    def add_anim_badge(slide, text):
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.8), Inches(0.4), Inches(2.7), Inches(0.38))
        box.fill.solid()
        box.fill.fore_color.rgb = RGBColor(17, 24, 39)
        box.line.color.rgb = PURPLE
        box.line.width = Pt(1)
        tf = box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"✨ ANIMATION: {text}"
        p.font.name = FONT_BODY
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = SKY_BLUE
        p.alignment = PP_ALIGN.CENTER

    # Helper: Add Styled Card Shape
    def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=BORDER_GLOW):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        if border_color:
            shape.line.color.rgb = border_color
            shape.line.width = Pt(1)
        else:
            shape.line.fill.background()
        return shape

    # Helper: Add Footer
    def add_footer(slide, current_slide, total_slides=14):
        foot_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.733), Inches(0.3))
        tf = foot_box.text_frame
        p = tf.paragraphs[0]
        p.text = f"CodeMedic AI  |  Hackathon Submission Presentation  •  Slide {current_slide} of {total_slides}"
        p.font.name = FONT_BODY
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_DIM

    # -------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    set_bg(slide1)

    # Hero Card Container (Right Side Graphic Card)
    hero_card = add_card(slide1, Inches(6.8), Inches(1.0), Inches(5.8), Inches(5.5), bg_color=CARD_BG, border_color=PRIMARY_BLUE)

    # Left Column Details
    # Hackathon Tag Badge
    badge = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.2), Inches(3.6), Inches(0.4))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(17, 24, 39)
    badge.line.color.rgb = CYAN
    badge.line.width = Pt(1)
    tf = badge.text_frame
    p = tf.paragraphs[0]
    p.text = "⚡ HACKATHON SUBMISSION  •  AI & DEV TOOLS"
    p.font.name = FONT_TITLE
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = CYAN
    p.alignment = PP_ALIGN.CENTER

    # Project Title
    tbox = slide1.shapes.add_textbox(Inches(0.78), Inches(1.8), Inches(5.8), Inches(1.2))
    tf = tbox.text_frame
    p = tf.paragraphs[0]
    p.text = "CodeMedic AI"
    p.font.name = FONT_TITLE
    p.font.size = Pt(48)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    # Tagline
    tagbox = slide1.shapes.add_textbox(Inches(0.78), Inches(3.0), Inches(5.8), Inches(0.6))
    tf = tagbox.text_frame
    p = tf.paragraphs[0]
    p.text = "Fix. Explain. Optimize. Powered by AI."
    p.font.name = FONT_TITLE
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = SKY_BLUE

    # Subtitle Description
    descbox = slide1.shapes.add_textbox(Inches(0.78), Inches(3.6), Inches(5.6), Inches(1.2))
    tf = descbox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "The AI-Powered Senior Software Engineer assistant that analyzes, debugs, secures, explains, and refactors developer code in real-time."
    p.font.name = FONT_BODY
    p.font.size = Pt(14)
    p.font.color.rgb = TEXT_MUTED

    # Highlights Pills
    pill_data = [
        ("🔍 Bug Detection", PRIMARY_BLUE),
        ("🛡️ Security Audit", PURPLE),
        ("🚀 Performance Fix", CYAN),
        ("🧪 Test Auto-Gen", GREEN)
    ]
    px = 0.8
    py = 5.0
    for text, color in pill_data:
        pbox = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(px), Inches(py), Inches(2.6), Inches(0.45))
        pbox.fill.solid()
        pbox.fill.fore_color.rgb = CARD_BG
        pbox.line.color.rgb = color
        pbox.line.width = Pt(1)
        tf = pbox.text_frame
        p = tf.paragraphs[0]
        p.text = text
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.alignment = PP_ALIGN.CENTER
        px += 2.8
        if px > 5.0:
            px = 0.8
            py += 0.65

    # Right Hero Card Contents (Code Editor Preview Graphic)
    # Window header bar
    hbar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.8), Inches(1.0), Inches(5.8), Inches(0.5))
    hbar.fill.solid()
    hbar.fill.fore_color.rgb = RGBColor(15, 23, 42)
    hbar.line.fill.background()
    # Red/Yellow/Green dots
    dots_x = 7.0
    for color in [RED, AMBER, GREEN]:
        dot = slide1.shapes.add_shape(MSO_SHAPE.OVAL, Inches(dots_x), Inches(1.15), Inches(0.18), Inches(0.18))
        dot.fill.solid()
        dot.fill.fore_color.rgb = color
        dot.line.fill.background()
        dots_x += 0.28
    
    # Title on bar
    htitle = slide1.shapes.add_textbox(Inches(8.0), Inches(1.05), Inches(4.0), Inches(0.4))
    tf = htitle.text_frame
    p = tf.paragraphs[0]
    p.text = "codemedic_assistant.py — AI Senior Engineer"
    p.font.name = FONT_BODY
    p.font.size = Pt(10)
    p.font.color.rgb = TEXT_MUTED

    # Hero Code Graphic Text
    code_text_box = slide1.shapes.add_textbox(Inches(7.0), Inches(1.6), Inches(5.4), Inches(4.7))
    tf = code_text_box.text_frame
    tf.word_wrap = True

    lines = [
        ("class CodeMedicEngine:", SKY_BLUE, True),
        ("    def analyze_repository(self, code_base):", TEXT_WHITE, False),
        ("        # Step 1: Detect Vulnerabilities", TEXT_DIM, False),
        ("        vulns = self.security_scanner.scan(code_base)", RED, False),
        ("        # Step 2: Auto-Fix & Optimize O(N) Complexity", TEXT_DIM, False),
        ("        fixed_code = self.ai_engine.refactor(code_base)", GREEN, False),
        ("        # Step 3: Auto-Generate Unit Tests", TEXT_DIM, False),
        ("        tests = self.test_gen.create_suite(fixed_code)", PURPLE, False),
        ("        return DiagnosticReport(status='HEALTHY', score=99.8)", CYAN, True)
    ]
    for line, color, bold in lines:
        p = tf.add_paragraph()
        p.text = line
        p.font.name = "Consolas"
        p.font.size = Pt(10.5)
        p.font.color.rgb = color
        p.font.bold = bold

    add_anim_badge(slide1, "Hero Slide Glow & Code Typewriter")
    add_footer(slide1, 1)

    # -------------------------------------------------------------
    # SLIDE 2: PROBLEM STATEMENT
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    set_bg(slide2)
    add_header(slide2, "THE REAL WORLD PROBLEM", "Software Engineering Bottlenecks & Friction", "Modern developers face overwhelming friction across debugging, security reviews, and maintenance.")
    add_anim_badge(slide2, "Staggered Stat Cards Drop-in")

    problems = [
        ("55%", "Debugging Time Loss", "Developers spend over half their working hours stepping through call stacks, tracking down elusive bugs, and understanding undocumented legacy code bases.", RED),
        ("78%", "Overlooked Vulns", "Security vulnerabilities bypass manual code reviews due to tight release deadlines and lack of dedicated security expertise in sprint teams.", AMBER),
        ("2-3 Days", "Code Review Stalls", "Pull requests sit idle waiting for senior team members to review logic, resulting in deployment latency and lost engineering momentum.", PRIMARY_BLUE),
        ("40%", "Technical Debt", "Inadequate unit test coverage and missing documentation compound code rot over time, making future refactoring high-risk.", PURPLE)
    ]

    cx, cy = 0.8, 1.9
    for stat, title, desc, accent in problems:
        card = add_card(slide2, Inches(cx), Inches(cy), Inches(5.6), Inches(2.3), bg_color=CARD_BG, border_color=accent)
        
        # Stat Number Callout
        st_box = slide2.shapes.add_textbox(Inches(cx + 0.2), Inches(cy + 0.15), Inches(5.2), Inches(0.8))
        tf = st_box.text_frame
        p = tf.paragraphs[0]
        p.text = stat
        p.font.name = FONT_TITLE
        p.font.size = Pt(36)
        p.font.bold = True
        p.font.color.rgb = accent

        # Stat Title
        t_box = slide2.shapes.add_textbox(Inches(cx + 0.2), Inches(cy + 0.85), Inches(5.2), Inches(0.4))
        tf = t_box.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = FONT_TITLE
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE

        # Stat Description
        d_box = slide2.shapes.add_textbox(Inches(cx + 0.2), Inches(cy + 1.25), Inches(5.2), Inches(0.95))
        tf = d_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = desc
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MUTED

        cx += 6.0
        if cx > 7.0:
            cx = 0.8
            cy += 2.5

    add_footer(slide2, 2)

    # -------------------------------------------------------------
    # SLIDE 3: SOLUTION
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    set_bg(slide3)
    add_header(slide3, "THE SOLUTION", "Introducing CodeMedic AI", "CodeMedic AI transforms developer workflows by acting as an intelligent Senior Engineer co-pilot.")
    add_anim_badge(slide3, "Horizontal Phase Build")

    pillars = [
        ("1. INGESTION", "Seamless Code Capture", "Upload entire source files or paste code directly into the built-in Monaco Code Editor with multi-language support.", PRIMARY_BLUE),
        ("2. AI COGNITION", "Senior Engineer Analysis", "Multi-layered LLM evaluation scans for syntax bugs, security flaws, O(N) complexity, and missing tests.", CYAN),
        ("3. ACTIONABLE OUTPUT", "One-Click Resolution", "Receive refactored code, instant security patches, comprehensive documentation, and downloadable PDF reports.", GREEN)
    ]

    px = 0.8
    for p_title, p_head, p_desc, p_accent in pillars:
        card = add_card(slide3, Inches(px), Inches(1.9), Inches(3.7), Inches(4.8), bg_color=CARD_BG, border_color=p_accent)
        
        # Step Badge
        sbox = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(px + 0.3), Inches(2.2), Inches(2.2), Inches(0.35))
        sbox.fill.solid()
        sbox.fill.fore_color.rgb = RGBColor(15, 23, 42)
        sbox.line.color.rgb = p_accent
        sbox.line.width = Pt(1)
        tf = sbox.text_frame
        p = tf.paragraphs[0]
        p.text = p_title
        p.font.name = FONT_TITLE
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = p_accent
        p.alignment = PP_ALIGN.CENTER

        # Head
        th = slide3.shapes.add_textbox(Inches(px + 0.3), Inches(2.7), Inches(3.1), Inches(0.8))
        tf = th.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = p_head
        p.font.name = FONT_TITLE
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE

        # Desc
        td = slide3.shapes.add_textbox(Inches(px + 0.3), Inches(3.6), Inches(3.1), Inches(2.8))
        tf = td.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = p_desc
        p.font.name = FONT_BODY
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_MUTED

        px += 4.0

    add_footer(slide3, 3)

    # -------------------------------------------------------------
    # SLIDE 4: ARCHITECTURE
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    set_bg(slide4)
    add_header(slide4, "SYSTEM ARCHITECTURE", "High-Performance Modular AI Engine Pipeline", "End-to-end decoupled system architecture optimized for low-latency code processing.")
    add_anim_badge(slide4, "Data Flow Pulse Animation")

    arch_blocks = [
        ("USER", "Developer / Client", "Web Dashboard\nMonaco Editor", PRIMARY_BLUE),
        ("FRONTEND", "React 18 + Vite", "Tailwind CSS\nState Management", SKY_BLUE),
        ("BACKEND", "FastAPI Server", "Async Processing\nREST & JSON API", CYAN),
        ("AI ENGINE", "Multi-Agent LLM", "Prompt Pipelines\nAST Parser", PURPLE),
        ("REPORTS", "Output Engine", "Refactored Code\nPDF / JSON Export", GREEN)
    ]

    ax = 0.8
    for name, sub, tech, accent in arch_blocks:
        card = add_card(slide4, Inches(ax), Inches(2.4), Inches(2.1), Inches(3.8), bg_color=CARD_BG, border_color=accent)
        
        # Block Header
        bh = slide4.shapes.add_textbox(Inches(ax + 0.1), Inches(2.6), Inches(1.9), Inches(0.4))
        tf = bh.text_frame
        p = tf.paragraphs[0]
        p.text = name
        p.font.name = FONT_TITLE
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = accent
        p.alignment = PP_ALIGN.CENTER

        # Subtitle
        bs = slide4.shapes.add_textbox(Inches(ax + 0.1), Inches(3.1), Inches(1.9), Inches(0.6))
        tf = bs.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = sub
        p.font.name = FONT_TITLE
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.alignment = PP_ALIGN.CENTER

        # Tech Details
        bt = slide4.shapes.add_textbox(Inches(ax + 0.1), Inches(3.8), Inches(1.9), Inches(2.0))
        tf = bt.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = tech
        p.font.name = FONT_BODY
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_MUTED
        p.alignment = PP_ALIGN.CENTER

        # Draw Connector Arrow if not last
        if ax < 9.0:
            arrow = slide4.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, Inches(ax + 2.15), Inches(4.1), Inches(0.2), Inches(0.3))
            arrow.fill.solid()
            arrow.fill.fore_color.rgb = SKY_BLUE
            arrow.line.fill.background()

        ax += 2.4

    add_footer(slide4, 4)

    # -------------------------------------------------------------
    # SLIDE 5: WORKFLOW
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    set_bg(slide5)
    add_header(slide5, "EXECTION WORKFLOW", "6-Stage Automated Code Enhancement Pipeline", "From raw source code input to verified production-grade delivery.")
    add_anim_badge(slide5, "Sequential Flow Highlight")

    steps = [
        ("Step 01", "Paste Code", "Input code via Monaco Editor or file upload.", PRIMARY_BLUE),
        ("Step 02", "AI Processing", "Tokenization, AST parsing & prompt dispatch.", SKY_BLUE),
        ("Step 03", "Bug Detection", "Static analysis & logic error detection.", RED),
        ("Step 04", "Security Scan", "OWASP top 10 & secret vulnerability check.", AMBER),
        ("Step 05", "Optimization", "Refactoring complexity O(N^2) to O(1).", GREEN),
        ("Step 06", "Download", "Export complete PDF report & test suite.", PURPLE)
    ]

    sx = 0.8
    sy = 2.2
    for step_num, title, desc, accent in steps:
        card = add_card(slide5, Inches(sx), Inches(sy), Inches(3.6), Inches(2.0), bg_color=CARD_BG, border_color=accent)
        
        # Step Number Pill
        sp = slide5.shapes.add_textbox(Inches(sx + 0.15), Inches(sy + 0.15), Inches(3.3), Inches(0.4))
        tf = sp.text_frame
        p = tf.paragraphs[0]
        p.text = step_num.upper()
        p.font.name = FONT_TITLE
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = accent

        # Step Title
        st = slide5.shapes.add_textbox(Inches(sx + 0.15), Inches(sy + 0.55), Inches(3.3), Inches(0.4))
        tf = st.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = FONT_TITLE
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE

        # Step Desc
        sd = slide5.shapes.add_textbox(Inches(sx + 0.15), Inches(sy + 0.95), Inches(3.3), Inches(0.95))
        tf = sd.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = desc
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MUTED

        sx += 3.9
        if sx > 9.0:
            sx = 0.8
            sy += 2.3

    add_footer(slide5, 5)

    # -------------------------------------------------------------
    # SLIDE 6: KEY FEATURES
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    set_bg(slide6)
    add_header(slide6, "FEATURE SUITE", "8 Senior-Engineer Grade AI Capabilities", "Everything developers need to audit, optimize, explain, and test code in one dashboard.")
    add_anim_badge(slide6, "Grid Zoom & Highlight")

    features = [
        ("🐛 AI Bug Detection", "Identifies syntax, logic, and runtime exceptions with exact line-number root cause explanations.", PRIMARY_BLUE),
        ("🔍 Automated Code Review", "Provides senior dev feedback on code style, design patterns, maintainability, and clean code principles.", CYAN),
        ("🛡️ Security Vulnerability Scanner", "Detects OWASP Top 10 risks, SQL injection, XSS, insecure dependencies, and hardcoded credentials.", RED),
        ("🚀 Performance Optimizer", "Highlights memory leaks, redundant loops, and refactors inefficient logic into optimal O(1) structures.", GREEN),
        ("📊 Complexity Analysis", "Calculates Cyclomatic complexity, Big-O time/space bounds, and code maintainability index scores.", AMBER),
        ("🧪 Unit Test Generator", "Auto-generates robust, production-ready unit test suites for PyTest, Jest, and JUnit frameworks.", PURPLE),
        ("📖 Documentation Generator", "Produces comprehensive JSDoc, PyDoc, and Markdown README files with clear parameter definitions.", SKY_BLUE),
        ("📄 Executive PDF Reports", "Exports downloadable, client-ready code audit PDF summaries formatted for engineering managers.", GREEN)
    ]

    fx = 0.8
    fy = 1.9
    for f_title, f_desc, f_accent in features:
        card = add_card(slide6, Inches(fx), Inches(fy), Inches(2.75), Inches(2.3), bg_color=CARD_BG, border_color=f_accent)
        
        # Title
        ft = slide6.shapes.add_textbox(Inches(fx + 0.15), Inches(fy + 0.15), Inches(2.45), Inches(0.65))
        tf = ft.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f_title
        p.font.name = FONT_TITLE
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE

        # Desc
        fd = slide6.shapes.add_textbox(Inches(fx + 0.15), Inches(fy + 0.8), Inches(2.45), Inches(1.4))
        tf = fd.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f_desc
        p.font.name = FONT_BODY
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_MUTED

        fx += 2.95
        if fx > 11.0:
            fx = 0.8
            fy += 2.45

    add_footer(slide6, 6)

    # -------------------------------------------------------------
    # SLIDE 7: TECHNOLOGY STACK
    # -------------------------------------------------------------
    slide7 = prs.slides.add_slide(blank_layout)
    set_bg(slide7)
    add_header(slide7, "TECHNOLOGY STACK", "Modern Tech Architecture", "Built using industry-standard enterprise frameworks for maximum performance.")
    add_anim_badge(slide7, "Category Card Reveal")

    stacks = [
        ("FRONTEND", "React 18  •  Vite", "TypeScript  •  Tailwind CSS\nMonaco Code Editor  •  Lucide Icons", PRIMARY_BLUE),
        ("BACKEND", "Python 3.11  •  FastAPI", "Uvicorn Async  •  Pydantic V2\nREST API Gateway  •  Gunicorn", CYAN),
        ("AI ENGINE", "Gemini Pro  •  GPT-4o", "LangChain Agents  •  AST Parser\nCustom Engineering Prompts", PURPLE),
        ("DATABASE & CACHE", "PostgreSQL  •  Redis", "SQLAlchemy ORM  •  Alembic\nSession Caching & Vector Storage", GREEN),
        ("DEPLOYMENT & DEVOPS", "Docker  •  Vercel", "Render Cloud  •  GitHub Actions\nCI/CD Automated Testing Pipeline", AMBER)
    ]

    tx = 0.8
    for cat, main_tech, sub_tech, accent in stacks:
        card = add_card(slide7, Inches(tx), Inches(2.1), Inches(2.18), Inches(4.5), bg_color=CARD_BG, border_color=accent)
        
        # Category Title
        ct = slide7.shapes.add_textbox(Inches(tx + 0.1), Inches(2.3), Inches(1.98), Inches(0.4))
        tf = ct.text_frame
        p = tf.paragraphs[0]
        p.text = cat
        p.font.name = FONT_TITLE
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = accent
        p.alignment = PP_ALIGN.CENTER

        # Main Tech
        mt = slide7.shapes.add_textbox(Inches(tx + 0.1), Inches(2.9), Inches(1.98), Inches(0.8))
        tf = mt.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = main_tech
        p.font.name = FONT_TITLE
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.alignment = PP_ALIGN.CENTER

        # Divider line
        div = slide7.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(tx + 0.3), Inches(3.8), Inches(1.58), Inches(0.02))
        div.fill.solid()
        div.fill.fore_color.rgb = accent
        div.line.fill.background()

        # Sub Tech
        st = slide7.shapes.add_textbox(Inches(tx + 0.1), Inches(4.0), Inches(1.98), Inches(2.3))
        tf = st.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = sub_tech
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MUTED
        p.alignment = PP_ALIGN.CENTER

        tx += 2.38

    add_footer(slide7, 7)

    # -------------------------------------------------------------
    # SLIDE 8: DEMO SCREENS
    # -------------------------------------------------------------
    slide8 = prs.slides.add_slide(blank_layout)
    set_bg(slide8)
    add_header(slide8, "PRODUCT EXPERIENCE", "Interactive App Dashboard & Interface", "A sleek dark-mode user interface engineered for maximum developer productivity.")
    add_anim_badge(slide8, "Mockup Carousel Slide")

    screens = [
        ("1. Landing Page", "Modern hero layout with code drop zone", PRIMARY_BLUE),
        ("2. Monaco Editor", "Live syntax highlighting & diagnostic squigglies", CYAN),
        ("3. AI Dashboard", "Real-time health score gauge & metric cards", GREEN),
        ("4. Analysis Hub", "Categorized bugs, security & complexity tab views", PURPLE),
        ("5. PDF Report Modal", "One-click audit export with formatted summaries", AMBER)
    ]

    sx = 0.8
    for s_name, s_sub, accent in screens:
        # Mockup Frame Card
        card = add_card(slide8, Inches(sx), Inches(2.1), Inches(2.18), Inches(4.5), bg_color=CARD_BG, border_color=accent)
        
        # Frame Top Bar
        bar = slide8.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(sx), Inches(2.1), Inches(2.18), Inches(0.4))
        bar.fill.solid()
        bar.fill.fore_color.rgb = RGBColor(15, 23, 42)
        bar.line.fill.background()

        # Dots
        dot = slide8.shapes.add_shape(MSO_SHAPE.OVAL, Inches(sx + 0.15), Inches(2.2), Inches(0.12), Inches(0.12))
        dot.fill.solid()
        dot.fill.fore_color.rgb = RED
        dot.line.fill.background()

        # Title Inside Frame
        st = slide8.shapes.add_textbox(Inches(sx + 0.1), Inches(2.7), Inches(1.98), Inches(0.8))
        tf = st.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = s_name
        p.font.name = FONT_TITLE
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.alignment = PP_ALIGN.CENTER

        # Subtitle Inside Frame
        sub = slide8.shapes.add_textbox(Inches(sx + 0.1), Inches(3.5), Inches(1.98), Inches(1.8))
        tf = sub.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = s_sub
        p.font.name = FONT_BODY
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_MUTED
        p.alignment = PP_ALIGN.CENTER

        # Placeholder Badge
        ph = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(sx + 0.2), Inches(5.5), Inches(1.78), Inches(0.8))
        ph.fill.solid()
        ph.fill.fore_color.rgb = RGBColor(15, 23, 42)
        ph.line.color.rgb = accent
        ph.line.width = Pt(1)
        tf = ph.text_frame
        p = tf.paragraphs[0]
        p.text = "[ Screenshot Placeholder ]"
        p.font.name = FONT_BODY
        p.font.size = Pt(8.5)
        p.font.color.rgb = SKY_BLUE
        p.alignment = PP_ALIGN.CENTER

        sx += 2.38

    add_footer(slide8, 8)

    # -------------------------------------------------------------
    # SLIDE 9: AI ANALYSIS DEEP DIVE
    # -------------------------------------------------------------
    slide9 = prs.slides.add_slide(blank_layout)
    set_bg(slide9)
    add_header(slide9, "AI ANALYSIS IN ACTION", "Side-by-Side Code Refactoring Comparison", "Watch CodeMedic AI instantly repair security vulnerabilities and optimize complexity.")
    add_anim_badge(slide9, "Code Diff Comparison Wipe")

    # Left Box: Original Code (Vulnerable)
    card1 = add_card(slide9, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.6), bg_color=CARD_BG, border_color=RED)
    
    lbl1 = slide9.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(5.2), Inches(0.4))
    tf = lbl1.text_frame
    p = tf.paragraphs[0]
    p.text = "❌ ORIGINAL CODE (Vulnerable & Unoptimized O(N^2))"
    p.font.name = FONT_TITLE
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = RED

    c1_box = slide9.shapes.add_textbox(Inches(1.0), Inches(2.6), Inches(5.2), Inches(3.8))
    tf = c1_box.text_frame
    tf.word_wrap = True
    bad_code = [
        ("def get_user_records(user_id):", TEXT_WHITE),
        ("    # CRITICAL: SQL Injection vulnerability", RED),
        ("    query = 'SELECT * FROM users WHERE id=' + user_id", RED),
        ("    res = db.execute(query)", TEXT_WHITE),
        ("    ", TEXT_WHITE),
        ("    # CRITICAL: O(N^2) inefficient nested loop", AMBER),
        ("    for i in range(len(res)):", AMBER),
        ("        for j in range(len(res)):", AMBER),
        ("            process_meta(res[i], res[j])", AMBER),
        ("    return res", TEXT_WHITE)
    ]
    for line, col in bad_code:
        p = tf.add_paragraph()
        p.text = line
        p.font.name = "Consolas"
        p.font.size = Pt(9.5)
        p.font.color.rgb = col

    # Right Box: CodeMedic AI Output (Fixed)
    card2 = add_card(slide9, Inches(6.8), Inches(2.0), Inches(5.733), Inches(4.6), bg_color=CARD_BG, border_color=GREEN)
    
    lbl2 = slide9.shapes.add_textbox(Inches(7.0), Inches(2.2), Inches(5.333), Inches(0.4))
    tf = lbl2.text_frame
    p = tf.paragraphs[0]
    p.text = "✅ CODEMEDIC AI OUTPUT (Secure & Optimized O(1))"
    p.font.name = FONT_TITLE
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = GREEN

    c2_box = slide9.shapes.add_textbox(Inches(7.0), Inches(2.6), Inches(5.333), Inches(3.8))
    tf = c2_box.text_frame
    tf.word_wrap = True
    good_code = [
        ("@dataclass", SKY_BLUE),
        ("class UserDTO:", TEXT_WHITE),
        ("    id: str; name: str", TEXT_MUTED),
        ("", TEXT_WHITE),
        ("async def get_user_records(user_id: str) -> Optional[UserDTO]:", GREEN),
        ("    '''Parametrized SQL query preventing injection + O(1) batch.'''", TEXT_DIM),
        ("    stmt = text('SELECT id, name FROM users WHERE id = :id')", GREEN),
        ("    res = await db.execute(stmt, {'id': user_id})", GREEN),
        ("    batch_process_meta(res) # Refactored to single pass", GREEN),
        ("    return UserDTO(**res.first())", GREEN)
    ]
    for line, col in good_code:
        p = tf.add_paragraph()
        p.text = line
        p.font.name = "Consolas"
        p.font.size = Pt(9.5)
        p.font.color.rgb = col

    add_footer(slide9, 9)

    # -------------------------------------------------------------
    # SLIDE 10: UNIQUE SELLING POINTS
    # -------------------------------------------------------------
    slide10 = prs.slides.add_slide(blank_layout)
    set_bg(slide10)
    add_header(slide10, "WHY CODEMEDIC AI?", "Competitive Advantage & USP Comparison Matrix", "How CodeMedic AI outperforms traditional linters and generic chat assistants.")
    add_anim_badge(slide10, "Table Row Highlight")

    # Table Container Card
    tcard = add_card(slide10, Inches(0.8), Inches(2.0), Inches(11.733), Inches(4.7), bg_color=CARD_BG, border_color=PRIMARY_BLUE)

    table_shape = slide10.shapes.add_table(7, 4, Inches(1.0), Inches(2.2), Inches(11.333), Inches(4.3))
    table = table_shape.table
    table.columns[0].width = Inches(3.533)
    table.columns[1].width = Inches(2.6)
    table.columns[2].width = Inches(2.6)
    table.columns[3].width = Inches(2.6)

    headers = ["FEATURE / CAPABILITY", "TRADITIONAL LINTERS", "GENERIC CHATBOTS", "CODEMEDIC AI"]
    for i, h in enumerate(headers):
        cell = table.cell(0, i)
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(15, 23, 42)
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.name = FONT_TITLE
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = CYAN if i == 3 else TEXT_WHITE

    rows = [
        ("Deep Context Security Analysis", "❌ Basic Regex Only", "⚠️ General Advice", "✅ Deep OWASP & Secret Scan"),
        ("Complexity & Big-O Refactoring", "❌ No Support", "⚠️ Manual Prompting", "✅ Automated O(N^2) to O(1) Fix"),
        ("Automated Unit Test Suite Gen", "❌ No Support", "⚠️ Fragmented Snippets", "✅ Complete PyTest / Jest Suites"),
        ("Executive PDF Report Export", "❌ Raw Logs Only", "❌ No Support", "✅ 1-Click Formatted Audit PDF"),
        ("Monaco Code Editor Experience", "❌ IDE Plugin Only", "❌ Simple Textarea", "✅ Fully Interactive Monaco UI"),
        ("Senior Developer Explanation", "❌ Rule Codes Only", "⚠️ Generic Summaries", "✅ Step-by-Step Educational Insights")
    ]

    for r_idx, row in enumerate(rows, start=1):
        for c_idx, val in enumerate(row):
            cell = table.cell(r_idx, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = CARD_BG
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = FONT_BODY
            p.font.size = Pt(10.5)
            if c_idx == 3:
                p.font.bold = True
                p.font.color.rgb = GREEN
            elif "❌" in val:
                p.font.color.rgb = RED
            elif "⚠️" in val:
                p.font.color.rgb = AMBER
            else:
                p.font.color.rgb = TEXT_WHITE

    add_footer(slide10, 10)

    # -------------------------------------------------------------
    # SLIDE 11: IMPACT
    # -------------------------------------------------------------
    slide11 = prs.slides.add_slide(blank_layout)
    set_bg(slide11)
    add_header(slide11, "REAL-WORLD IMPACT", "Empowering Software Teams & Developers", "Measurable value delivered across the entire engineering lifecycle.")
    add_anim_badge(slide11, "Card Entrance Transition")

    impacts = [
        ("👨‍💻 INDIVIDUAL DEVELOPERS", "Save 5+ Hours Weekly", "Eliminate repetitive debugging, get instant bug fixes, and write production-grade code faster.", PRIMARY_BLUE),
        ("🎓 CS STUDENTS & LEARNERS", "Master Senior Best Practices", "Learn software architecture, security patterns, and Big-O optimization through detailed AI explanations.", CYAN),
        ("🚀 ENGINEERING TEAMS", "Accelerate PR Reviews by 60%", "Remove code review bottlenecks, enforce consistent code standards, and ship features faster.", GREEN),
        ("🏢 ENTERPRISES & OPEN SOURCE", "Zero Security Compromise", "Prevent zero-day vulnerabilities, maintain updated documentation, and reduce technical debt.", PURPLE)
    ]

    ix, iy = 0.8, 2.0
    for category, headline, desc, accent in impacts:
        card = add_card(slide11, Inches(ix), Inches(iy), Inches(5.6), Inches(2.2), bg_color=CARD_BG, border_color=accent)
        
        # Category
        ic = slide11.shapes.add_textbox(Inches(ix + 0.2), Inches(iy + 0.15), Inches(5.2), Inches(0.35))
        tf = ic.text_frame
        p = tf.paragraphs[0]
        p.text = category
        p.font.name = FONT_TITLE
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = accent

        # Headline
        ih = slide11.shapes.add_textbox(Inches(ix + 0.2), Inches(iy + 0.55), Inches(5.2), Inches(0.5))
        tf = ih.text_frame
        p = tf.paragraphs[0]
        p.text = headline
        p.font.name = FONT_TITLE
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE

        # Desc
        id_box = slide11.shapes.add_textbox(Inches(ix + 0.2), Inches(iy + 1.1), Inches(5.2), Inches(0.95))
        tf = id_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = desc
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MUTED

        ix += 6.0
        if ix > 7.0:
            ix = 0.8
            iy += 2.4

    add_footer(slide11, 11)

    # -------------------------------------------------------------
    # SLIDE 12: FUTURE SCOPE
    # -------------------------------------------------------------
    slide12 = prs.slides.add_slide(blank_layout)
    set_bg(slide12)
    add_header(slide12, "FUTURE ROADMAP", "Product Evolution & Vision", "Expanding from an interactive dashboard to complete developer ecosystem integration.")
    add_anim_badge(slide12, "Roadmap Line Build")

    roadmap = [
        ("PHASE 01", "VS Code Extension", "Native IDE extension with squiggly error highlights and 1-click refactoring.", PRIMARY_BLUE),
        ("PHASE 02", "GitHub CI/CD Integration", "Automated Pull Request scanner blocking vulnerable code merges.", SKY_BLUE),
        ("PHASE 03", "Multi-File Analysis", "Cross-file dependency graph analysis and whole-repo refactoring.", CYAN),
        ("PHASE 04", "Team Collaboration Memory", "Shared team coding standards, guidelines, and snippet memory.", PURPLE),
        ("PHASE 05", "Enterprise API Platform", "REST API & self-hosted on-prem LLM deployment for security compliance.", AMBER),
        ("PHASE 06", "Custom Fine-Tuned Models", "Domain-specific AI models trained on proprietary codebase styles.", GREEN)
    ]

    rx, ry = 0.8, 2.0
    for phase, title, desc, accent in roadmap:
        card = add_card(slide12, Inches(rx), Inches(ry), Inches(3.6), Inches(2.2), bg_color=CARD_BG, border_color=accent)
        
        # Phase Tag
        rp = slide12.shapes.add_textbox(Inches(rx + 0.15), Inches(ry + 0.15), Inches(3.3), Inches(0.35))
        tf = rp.text_frame
        p = tf.paragraphs[0]
        p.text = phase
        p.font.name = FONT_TITLE
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = accent

        # Title
        rt = slide12.shapes.add_textbox(Inches(rx + 0.15), Inches(ry + 0.5), Inches(3.3), Inches(0.55))
        tf = rt.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = FONT_TITLE
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE

        # Desc
        rd = slide12.shapes.add_textbox(Inches(rx + 0.15), Inches(ry + 1.1), Inches(3.3), Inches(0.95))
        tf = rd.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = desc
        p.font.name = FONT_BODY
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_MUTED

        rx += 3.9
        if rx > 9.0:
            rx = 0.8
            ry += 2.4

    add_footer(slide12, 12)

    # -------------------------------------------------------------
    # SLIDE 13: LIVE DEMO
    # -------------------------------------------------------------
    slide13 = prs.slides.add_slide(blank_layout)
    set_bg(slide13)
    add_header(slide13, "PRESENTATION DEMO", "Live Stage Demonstration Sequence", "Follow along as we present CodeMedic AI live in action.")
    add_anim_badge(slide13, "Step-by-Step Live Highlight")

    demo_steps = [
        ("Step 1: Open Web App", "Launch CodeMedic AI Web Dashboard", PRIMARY_BLUE),
        ("Step 2: Input Vulnerable Code", "Paste SQLi O(N^2) code snippet into Monaco Editor", CYAN),
        ("Step 3: Trigger AI Analysis", "Click 'Analyze Code' button to activate multi-agent scan", PURPLE),
        ("Step 4: Review Security & Fixes", "Inspect detected vulnerabilities & O(1) refactored code", GREEN),
        ("Step 5: Inspect Generated Tests", "View auto-generated PyTest unit test suite", SKY_BLUE),
        ("Step 6: Download PDF Report", "Click 'Export Audit' to download formatted executive PDF", AMBER)
    ]

    dx = 0.8
    dy = 2.0
    for d_title, d_sub, accent in demo_steps:
        card = add_card(slide13, Inches(dx), Inches(dy), Inches(5.6), Inches(1.35), bg_color=CARD_BG, border_color=accent)
        
        # Step Header
        dh = slide13.shapes.add_textbox(Inches(dx + 0.2), Inches(dy + 0.15), Inches(5.2), Inches(0.4))
        tf = dh.text_frame
        p = tf.paragraphs[0]
        p.text = d_title
        p.font.name = FONT_TITLE
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = accent

        # Step Subtext
        ds = slide13.shapes.add_textbox(Inches(dx + 0.2), Inches(dy + 0.55), Inches(5.2), Inches(0.65))
        tf = ds.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = d_sub
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_WHITE

        dx += 6.0
        if dx > 7.0:
            dx = 0.8
            dy += 1.55

    add_footer(slide13, 13)

    # -------------------------------------------------------------
    # SLIDE 14: THANK YOU & LINKS
    # -------------------------------------------------------------
    slide14 = prs.slides.add_slide(blank_layout)
    set_bg(slide14)

    # Left Container Hero Card
    card = add_card(slide14, Inches(0.8), Inches(1.0), Inches(7.5), Inches(5.5), bg_color=CARD_BG, border_color=PRIMARY_BLUE)

    tbox = slide14.shapes.add_textbox(Inches(1.1), Inches(1.4), Inches(7.0), Inches(1.0))
    tf = tbox.text_frame
    p = tf.paragraphs[0]
    p.text = "CodeMedic AI"
    p.font.name = FONT_TITLE
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    tag = slide14.shapes.add_textbox(Inches(1.1), Inches(2.4), Inches(7.0), Inches(0.5))
    tf = tag.text_frame
    p = tf.paragraphs[0]
    p.text = "Fix. Explain. Optimize. Powered by AI."
    p.font.name = FONT_TITLE
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = SKY_BLUE

    desc = slide14.shapes.add_textbox(Inches(1.1), Inches(3.0), Inches(6.8), Inches(1.0))
    tf = desc.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Thank you for reviewing CodeMedic AI! Together, let's elevate software engineering quality, security, and developer speed with AI co-pilots."
    p.font.name = FONT_BODY
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_MUTED

    links = [
        ("📂 GitHub Repository:", "github.com/username/codemedic-ai", CYAN),
        ("🌐 Live Interactive Demo:", "codemedic-ai.vercel.app", GREEN),
        ("📧 Team Contact:", "team@codemedic.ai", PURPLE)
    ]
    ly = 4.2
    for label, url, color in links:
        box = slide14.shapes.add_textbox(Inches(1.1), Inches(ly), Inches(6.8), Inches(0.45))
        tf = box.text_frame
        p = tf.paragraphs[0]
        p.text = f"{label}  {url}"
        p.font.name = FONT_BODY
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = color
        ly += 0.5

    # Right Card: QR Code / Submission Placeholder Frame
    qr_card = add_card(slide14, Inches(8.6), Inches(1.0), Inches(3.933), Inches(5.5), bg_color=CARD_BG, border_color=CYAN)

    qr_box = slide14.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(9.1), Inches(1.6), Inches(2.933), Inches(2.933))
    qr_box.fill.solid()
    qr_box.fill.fore_color.rgb = RGBColor(15, 23, 42)
    qr_box.line.color.rgb = SKY_BLUE
    qr_box.line.width = Pt(1)
    tf = qr_box.text_frame
    p = tf.paragraphs[0]
    p.text = "[ QR CODE PLACEHOLDER ]\n\nScan to Access\nLive Demo & Docs"
    p.font.name = FONT_BODY
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.alignment = PP_ALIGN.CENTER

    qt = slide14.shapes.add_textbox(Inches(8.8), Inches(4.8), Inches(3.533), Inches(1.2))
    tf = qt.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Q & A SESSION\nWe welcome questions from the judges and audience!"
    p.font.name = FONT_TITLE
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.alignment = PP_ALIGN.CENTER

    add_anim_badge(slide14, "Final Slide Pulse & Call-to-Action")
    add_footer(slide14, 14)

    output_filename = "CodeMedic_AI_Hackathon_Presentation.pptx"
    prs.save(output_filename)
    print(f"SUCCESS: Presentation saved as '{output_filename}' in {os.getcwd()}")

if __name__ == "__main__":
    create_presentation()
