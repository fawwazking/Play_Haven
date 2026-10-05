import os
import django
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from catalog.models import Platform, Game

doc = Document()

# Set standard margins (1 inch)
for section in doc.sections:
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)

# Helper for cell shading
def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

# Title & Metadata
title_p = doc.add_paragraph()
title_p.paragraph_format.space_before = Pt(0)
title_p.paragraph_format.space_after = Pt(4)
r_title = title_p.add_run("PLAYHAVEN E-COMMERCE")
r_title.font.name = "Arial"
r_title.font.size = Pt(24)
r_title.font.bold = True
r_title.font.color.rgb = RGBColor(15, 23, 42) # Slate-900

sub_p = doc.add_paragraph()
sub_p.paragraph_format.space_after = Pt(16)
r_sub = sub_p.add_run("Dokumen Spesifikasi Lengkap Kebutuhan Aset Gambar & Poster Game")
r_sub.font.name = "Arial"
r_sub.font.size = Pt(13)
r_sub.font.color.rgb = RGBColor(2, 132, 199) # Sky-600

# Meta info box
meta_table = doc.add_table(rows=3, cols=2)
meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
meta_data = [
    ("Proyek", "Rancang Bangun E-Commerce BD Game Berbasis Decoupled Architecture"),
    ("Tim Pengembang", "Fawwaz Wijdan (3337240058) & Yafi Nur Firos (3337240001)"),
    ("Total Kebutuhan Aset", "84 File Gambar (70 Cover Kaset BD, 7 Mesin Konsol, 3 Aksesoris, 4 Hero Banner)")
]
for idx, (label, val) in enumerate(meta_data):
    c0 = meta_table.cell(idx, 0)
    c1 = meta_table.cell(idx, 1)
    c0.width = Inches(1.8)
    c1.width = Inches(4.7)
    set_cell_background(c0, "F1F5F9")
    set_cell_background(c1, "F8FAFC")
    set_cell_margins(c0, 80, 80, 120, 120)
    set_cell_margins(c1, 80, 80, 120, 120)
    
    p0 = c0.paragraphs[0]
    p0.paragraph_format.space_after = Pt(0)
    r0 = p0.add_run(label)
    r0.font.name = "Arial"
    r0.font.size = Pt(9.5)
    r0.font.bold = True
    r0.font.color.rgb = RGBColor(51, 65, 85)
    
    p1 = c1.paragraphs[0]
    p1.paragraph_format.space_after = Pt(0)
    r1 = p1.add_run(val)
    r1.font.name = "Arial"
    r1.font.size = Pt(9.5)
    r1.font.color.rgb = RGBColor(15, 23, 42)

doc.add_paragraph().paragraph_format.space_after = Pt(12)

# Heading 1: Panduan Teknis
h1 = doc.add_paragraph()
r_h1 = h1.add_run("1. Panduan Format & Standar Resolusi")
r_h1.font.name = "Arial"
r_h1.font.size = Pt(14)
r_h1.font.bold = True
r_h1.font.color.rgb = RGBColor(15, 23, 42)

guidelines = [
    ("Kaset Game Fisik (70 Gambar):", "Rasio vertikal / potret 3:4 atau box art kaset BD resmi. Format: JPG atau WebP. Resolusi minimal 600 x 800 px (disarankan 900 x 1200 px). Pastikan teks judul game dan logo platform terbaca tajam."),
    ("Unit Mesin Konsol (7 Gambar):", "Rasio 1:1 (persegi) dengan latar belakang transparan (format PNG) atau latar abu-abu netral studio bersih. Resolusi minimal 800 x 800 px."),
    ("Controller & Aksesoris (3 Gambar):", "Format PNG transparan resolusi tinggi (minimal 800 x 800 px)."),
    ("Hero Slider Carousel (4 Gambar):", "Rasio horizontal ultra-wide 16:9 atau 1920 x 600 px (format JPG/WebP)."),
    ("Struktur Folder Penyimpanan:", "C:\\Sem5\\E Commerce\\PlayHaven\\frontend\\public\\images\\ (subfolder: games/, consoles/, accessories/, banners/).")
]

for title, desc in guidelines:
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(4)
    r_b = p.add_run(title + " ")
    r_b.font.name = "Arial"
    r_b.font.size = Pt(10)
    r_b.font.bold = True
    r_d = p.add_run(desc)
    r_d.font.name = "Arial"
    r_d.font.size = Pt(9.5)

doc.add_paragraph().paragraph_format.space_after = Pt(8)

# Heading 2: Tabel Game per Platform
h2 = doc.add_paragraph()
r_h2 = h2.add_run("2. Rincian 70 Poster Cover Kaset Game BD Fisik")
r_h2.font.name = "Arial"
r_h2.font.size = Pt(14)
r_h2.font.bold = True
r_h2.font.color.rgb = RGBColor(15, 23, 42)

platforms = Platform.objects.all().order_by('name')

global_counter = 1

for p in platforms:
    games = Game.objects.filter(variants__platform=p).distinct()
    
    p_header = doc.add_paragraph()
    p_header.paragraph_format.space_before = Pt(10)
    p_header.paragraph_format.space_after = Pt(4)
    r_ph = p_header.add_run(f"Kategori: {p.name} ({p.get_category_display()}) — Total: {games.count()} Judul")
    r_ph.font.name = "Arial"
    r_ph.font.size = Pt(11)
    r_ph.font.bold = True
    r_ph.font.color.rgb = RGBColor(2, 132, 199)
    
    table = doc.add_table(rows=1, cols=5)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = 'Table Grid'
    
    hdr = table.rows[0]
    headers_text = ["No", "Judul Game", "Publisher / Tahun", "Rekomendasi Nama File", "Tipe Kaset"]
    col_widths = [Inches(0.5), Inches(2.2), Inches(1.5), Inches(1.6), Inches(0.9)]
    
    for i, title in enumerate(headers_text):
        cell = hdr.cells[i]
        cell.width = col_widths[i]
        set_cell_background(cell, "0F172A") # Slate-900
        set_cell_margins(cell, 80, 80, 80, 80)
        p_c = cell.paragraphs[0]
        p_c.paragraph_format.space_after = Pt(0)
        run = p_c.add_run(title)
        run.font.name = "Arial"
        run.font.size = Pt(8.5)
        run.font.bold = True
        run.font.color.rgb = RGBColor(255, 255, 255)
        
    for g_idx, game in enumerate(games, 1):
        row = table.add_row()
        cells = row.cells
        for i, w in enumerate(col_widths):
            cells[i].width = w
            set_cell_margins(cells[i], 60, 60, 80, 80)
            if g_idx % 2 == 0:
                set_cell_background(cells[i], "F8FAFC")
                
        # Data
        cells[0].paragraphs[0].add_run(str(global_counter)).font.size = Pt(8.5)
        cells[1].paragraphs[0].add_run(game.title).font.bold = True
        cells[1].paragraphs[0].runs[0].font.size = Pt(8.5)
        
        cells[2].paragraphs[0].add_run(f"{game.publisher} ({game.release_year})").font.size = Pt(8)
        
        suggested_slug = f"{p.slug}-{game.slug[:20].strip('-')}.jpg"
        cells[3].paragraphs[0].add_run(suggested_slug).font.size = Pt(8)
        cells[3].paragraphs[0].runs[0].font.name = "Courier New"
        
        t_text = "Cartridge" if p.slug == 'switch' else "BD / Disc"
        cells[4].paragraphs[0].add_run(t_text).font.size = Pt(8)
        
        global_counter += 1

doc.add_page_break()

# Heading 3: Unit Konsol, Aksesoris & Banner
h3 = doc.add_paragraph()
r_h3 = h3.add_run("3. Rincian Konsol, Aksesoris, & Banner Slider")
r_h3.font.name = "Arial"
r_h3.font.size = Pt(14)
r_h3.font.bold = True
r_h3.font.color.rgb = RGBColor(15, 23, 42)

doc.add_paragraph("Tabel berikut memuat 14 aset tambahan untuk katalog mesin konsol, controller, dan carousel promosi:")

other_table = doc.add_table(rows=1, cols=4)
other_table.alignment = WD_TABLE_ALIGNMENT.CENTER
other_table.style = 'Table Grid'

hdr2 = other_table.rows[0]
hdr2_titles = ["No", "Kategori Aset", "Nama Produk / Banner", "Deskripsi Visual & Format"]
widths2 = [Inches(0.6), Inches(1.5), Inches(2.2), Inches(2.4)]

for i, t in enumerate(hdr2_titles):
    c = hdr2.cells[i]
    c.width = widths2[i]
    set_cell_background(c, "0F172A")
    set_cell_margins(c, 80, 80, 80, 80)
    p = c.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(t)
    r.font.name = "Arial"
    r.font.size = Pt(8.5)
    r.font.bold = True
    r.font.color.rgb = RGBColor(255, 255, 255)

other_items = [
    # Konsol
    ("Konsol Game", "PlayStation 5 Disc Edition", "Unit konsol putih + DualSense Controller (PNG Transparan / 800x800)"),
    ("Konsol Game", "PlayStation 4 Pro / Slim", "Unit konsol hitam matte + DualShock 4 (PNG Transparan / 800x800)"),
    ("Konsol Game", "PlayStation 3 Classic", "Unit konsol hitam fat/slim + DualShock 3 (PNG Transparan / 800x800)"),
    ("Konsol Game", "Xbox Series X", "Monolith tower hitam + Wireless Controller (PNG Transparan / 800x800)"),
    ("Konsol Game", "Xbox One S / X", "Unit konsol Xbox One putih/hitam + Controller (PNG Transparan / 800x800)"),
    ("Konsol Game", "Nintendo Switch OLED", "Dock putih + Unit layar OLED Joy-Con putih (PNG Transparan / 800x800)"),
    ("Konsol Game", "Nintendo Wii U Deluxe Set", "Konsol hitam + GamePad touchscreen controller (PNG Transparan / 800x800)"),
    # Aksesoris
    ("Aksesoris", "Sony DualSense Controller", "Controller original PS5 warna White / Midnight Black (PNG Transparan)"),
    ("Aksesoris", "Xbox Wireless Controller", "Controller original Xbox warna Carbon Black (PNG Transparan)"),
    ("Aksesoris", "Nintendo Switch Pro Controller", "Controller ergonomis original Switch (PNG Transparan)"),
    # Hero Slider
    ("Hero Banner", "PlayStation 5 Exclusive Showcase", "Banner horizontal 1920x600 px (Spider-Man 2 / Final Fantasy)"),
    ("Hero Banner", "Nintendo Switch Adventure Promo", "Banner horizontal 1920x600 px (Zelda Tears of the Kingdom / Mario)"),
    ("Hero Banner", "Midtrans Payment Gateway Promo", "Banner horizontal 1920x600 px (BCA, QRIS, Kartu Kredit, Keamanan)"),
    ("Hero Banner", "Pre-owned Verified Guarantee", "Banner horizontal 1920x600 px (Garansi kaset bekas lolos QC disc)")
]

for idx, (cat, name, spec) in enumerate(other_items, 71):
    row = other_table.add_row()
    c = row.cells
    for i, w in enumerate(widths2):
        c[i].width = w
        set_cell_margins(c[i], 60, 60, 80, 80)
        if (idx - 70) % 2 == 0:
            set_cell_background(c[i], "F8FAFC")
            
    c[0].paragraphs[0].add_run(str(idx)).font.size = Pt(8.5)
    c[1].paragraphs[0].add_run(cat).font.bold = True
    c[1].paragraphs[0].runs[0].font.size = Pt(8.5)
    c[2].paragraphs[0].add_run(name).font.size = Pt(8.5)
    c[3].paragraphs[0].add_run(spec).font.size = Pt(8)

output_path = r"C:\Sem5\E Commerce\PlayHaven\Daftar_Kebutuhan_Aset_Gambar_PlayHaven.docx"
doc.save(output_path)
print("DOCX_CREATED_SUCCESSFULLY:", output_path)
