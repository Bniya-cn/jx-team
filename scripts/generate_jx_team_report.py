#!/usr/bin/env python3
from __future__ import annotations

import re
import zipfile
from pathlib import Path
from typing import Iterable
from xml.sax.saxutils import escape as xml_escape
import xml.etree.ElementTree as ET


W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
WP_NS = "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
A_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"
PIC_NS = "http://schemas.openxmlformats.org/drawingml/2006/picture"
XML_NS = "http://www.w3.org/XML/1998/namespace"

EMU_PER_INCH = 914400
TWIPS_PER_INCH = 1440
A4_WIDTH = 11906
A4_HEIGHT = 16838
MARGIN = 1440
PAGE_START = 1

OUT_PATH = Path("/Users/daijinglin/jx-team-main/JX-Team校园主题游戏商店系统设计与实现.docx")

ET.register_namespace("w", W_NS)
ET.register_namespace("r", R_NS)
ET.register_namespace("wp", WP_NS)
ET.register_namespace("a", A_NS)
ET.register_namespace("pic", PIC_NS)
ET.register_namespace("pkg", PKG_REL_NS)


def qn(ns: str, tag: str) -> str:
    return f"{{{ns}}}{tag}"


def pt_to_halfpoints(pt: float) -> str:
    return str(int(round(pt * 2)))


def pt_to_twips(pt: float) -> str:
    return str(int(round(pt * 20)))


def inches_to_emu(value: float) -> str:
    return str(int(round(value * EMU_PER_INCH)))


def make_el(tag: str, attrib: dict[str, str] | None = None, text: str | None = None) -> ET.Element:
    el = ET.Element(tag, attrib or {})
    if text is not None:
        el.text = text
    return el


def style_run(
    text: str,
    *,
    font_east: str = "SimSun",
    font_ascii: str = "Times New Roman",
    size_pt: float = 12,
    bold: bool = False,
    italic: bool = False,
    color: str = "000000",
    underline: bool = False,
    preserve_space: bool = False,
) -> ET.Element:
    r = make_el(qn(W_NS, "r"))
    rpr = make_el(qn(W_NS, "rPr"))
    rpr.append(make_el(qn(W_NS, "rFonts"), {
        qn(W_NS, "ascii"): font_ascii,
        qn(W_NS, "hAnsi"): font_ascii,
        qn(W_NS, "eastAsia"): font_east,
        qn(W_NS, "cs"): font_east,
    }))
    rpr.append(make_el(qn(W_NS, "sz"), {qn(W_NS, "val"): pt_to_halfpoints(size_pt)}))
    rpr.append(make_el(qn(W_NS, "szCs"), {qn(W_NS, "val"): pt_to_halfpoints(size_pt)}))
    if bold:
        rpr.append(make_el(qn(W_NS, "b")))
        rpr.append(make_el(qn(W_NS, "bCs")))
    if italic:
        rpr.append(make_el(qn(W_NS, "i")))
        rpr.append(make_el(qn(W_NS, "iCs")))
    if underline:
        rpr.append(make_el(qn(W_NS, "u"), {qn(W_NS, "val"): "single"}))
    rpr.append(make_el(qn(W_NS, "color"), {qn(W_NS, "val"): color}))
    r.append(rpr)
    t = make_el(qn(W_NS, "t"))
    if preserve_space:
        t.set(qn(XML_NS, "space"), "preserve")
    t.text = text
    r.append(t)
    return r


def paragraph(
    runs: Iterable[ET.Element] | None = None,
    *,
    style: str | None = None,
    align: str | None = None,
    before_pt: float | None = None,
    after_pt: float | None = None,
    line_pt: float | None = None,
    line_rule: str | None = None,
    first_line_twips: int | None = None,
    left_twips: int | None = None,
    right_twips: int | None = None,
    keep_next: bool = False,
    keep_lines: bool = False,
    page_break_before: bool = False,
    outline_level: int | None = None,
) -> ET.Element:
    p = make_el(qn(W_NS, "p"))
    ppr = make_el(qn(W_NS, "pPr"))
    if style:
        ppr.append(make_el(qn(W_NS, "pStyle"), {qn(W_NS, "val"): style}))
    if align:
        ppr.append(make_el(qn(W_NS, "jc"), {qn(W_NS, "val"): align}))
    if before_pt is not None or after_pt is not None or line_pt is not None or line_rule is not None:
        spacing_attrib: dict[str, str] = {}
        if before_pt is not None:
            spacing_attrib[qn(W_NS, "before")] = pt_to_twips(before_pt)
        if after_pt is not None:
            spacing_attrib[qn(W_NS, "after")] = pt_to_twips(after_pt)
        if line_pt is not None:
            spacing_attrib[qn(W_NS, "line")] = pt_to_twips(line_pt)
        if line_rule is not None:
            spacing_attrib[qn(W_NS, "lineRule")] = line_rule
        ppr.append(make_el(qn(W_NS, "spacing"), spacing_attrib))
    if first_line_twips is not None or left_twips is not None or right_twips is not None:
        ind_attrib: dict[str, str] = {}
        if first_line_twips is not None:
            ind_attrib[qn(W_NS, "firstLine")] = str(first_line_twips)
        if left_twips is not None:
            ind_attrib[qn(W_NS, "left")] = str(left_twips)
        if right_twips is not None:
            ind_attrib[qn(W_NS, "right")] = str(right_twips)
        ppr.append(make_el(qn(W_NS, "ind"), ind_attrib))
    if keep_next:
        ppr.append(make_el(qn(W_NS, "keepNext")))
    if keep_lines:
        ppr.append(make_el(qn(W_NS, "keepLines")))
    if page_break_before:
        ppr.append(make_el(qn(W_NS, "pageBreakBefore")))
    if outline_level is not None:
        ppr.append(make_el(qn(W_NS, "outlineLvl"), {qn(W_NS, "val"): str(outline_level)}))
    p.append(ppr)
    if runs:
        for r in runs:
            p.append(r)
    return p


def body_para(
    text: str,
    *,
    bold: bool = False,
    align: str = "both",
    before_pt: float = 0,
    after_pt: float = 0,
    line_pt: float = 20,
    first_line_twips: int = 480,
    style: str = "Normal",
    size_pt: float = 12,
) -> ET.Element:
    return paragraph(
        [style_run(text, bold=bold, size_pt=size_pt)],
        style=style,
        align=align,
        before_pt=before_pt,
        after_pt=after_pt,
        line_pt=line_pt,
        line_rule="exact",
        first_line_twips=first_line_twips,
    )


def heading_para(
    text: str,
    *,
    style: str,
    level: int,
    align: str,
    size_pt: float,
    before_pt: float,
    after_pt: float,
    page_break_before: bool = False,
) -> ET.Element:
    return paragraph(
        [style_run(text, font_east="SimHei", font_ascii="Times New Roman", size_pt=size_pt, bold=True)],
        style=style,
        align=align,
        before_pt=before_pt,
        after_pt=after_pt,
        line_pt=20,
        line_rule="auto",
        first_line_twips=0,
        page_break_before=page_break_before,
        keep_next=True,
        outline_level=level,
    )


def caption_para(text: str) -> ET.Element:
    return paragraph(
        [style_run(text, size_pt=10.5, font_east="SimSun", font_ascii="Times New Roman")],
        style="Caption",
        align="center",
        before_pt=6,
        after_pt=6,
        line_pt=14,
        line_rule="auto",
        first_line_twips=0,
    )


def blank_para(height_pt: float = 10) -> ET.Element:
    return paragraph(
        [style_run("", size_pt=1)],
        style="Normal",
        before_pt=0,
        after_pt=height_pt,
        line_pt=14,
        line_rule="auto",
        first_line_twips=0,
    )


def toc_field_para() -> ET.Element:
    p = paragraph(
        [],
        style="Normal",
        align="left",
        before_pt=0,
        after_pt=0,
        line_pt=20,
        line_rule="auto",
        first_line_twips=0,
    )
    fld_begin = make_el(qn(W_NS, "fldChar"), {qn(W_NS, "fldCharType"): "begin"})
    instr = make_el(qn(W_NS, "instrText"), {qn(XML_NS, "space"): "preserve"}, "TOC \\o \"1-3\" \\h \\z \\u")
    fld_sep = make_el(qn(W_NS, "fldChar"), {qn(W_NS, "fldCharType"): "separate"})
    fld_end = make_el(qn(W_NS, "fldChar"), {qn(W_NS, "fldCharType"): "end"})
    for el in (fld_begin, instr, fld_sep):
        r = make_el(qn(W_NS, "r"))
        r.append(el)
        p.append(r)
    r = make_el(qn(W_NS, "r"))
    r.append(fld_end)
    p.append(r)
    return p


def page_break_para() -> ET.Element:
    p = paragraph([], style="Normal", align="left", before_pt=0, after_pt=0, line_pt=1, line_rule="auto", first_line_twips=0)
    r = make_el(qn(W_NS, "r"))
    r.append(make_el(qn(W_NS, "br"), {qn(W_NS, "type"): "page"}))
    p.append(r)
    return p


def field_run(field_type: str) -> ET.Element:
    r = make_el(qn(W_NS, "r"))
    r.append(make_el(qn(W_NS, "fldChar"), {qn(W_NS, "fldCharType"): field_type}))
    return r


def page_number_field_para() -> ET.Element:
    p = paragraph(
        [],
        style="PageFooter",
        align="center",
        before_pt=0,
        after_pt=0,
        line_pt=14,
        line_rule="auto",
        first_line_twips=0,
    )
    p.append(field_run("begin"))
    r = make_el(qn(W_NS, "r"))
    r.append(make_el(qn(W_NS, "instrText"), {qn(XML_NS, "space"): "preserve"}, "PAGE"))
    p.append(r)
    p.append(field_run("separate"))
    p.append(style_run("1", font_east="SimSun", font_ascii="Times New Roman", size_pt=10.5))
    p.append(field_run("end"))
    return p


def create_cell(text: str, width_twips: int, *, bold: bool = False, fill: str | None = None, align: str = "left") -> ET.Element:
    tc = make_el(qn(W_NS, "tc"))
    tcpr = make_el(qn(W_NS, "tcPr"))
    tcw = make_el(qn(W_NS, "tcW"), {qn(W_NS, "w"): str(width_twips), qn(W_NS, "type"): "dxa"})
    tcpr.append(tcw)
    tcmar = make_el(qn(W_NS, "tcMar"))
    for side in ("top", "bottom", "start", "end"):
        tcmar.append(make_el(qn(W_NS, side), {qn(W_NS, "w"): "120", qn(W_NS, "type"): "dxa"}))
    tcpr.append(tcmar)
    if fill:
        tcpr.append(make_el(qn(W_NS, "shd"), {
            qn(W_NS, "val"): "clear",
            qn(W_NS, "color"): "auto",
            qn(W_NS, "fill"): fill,
        }))
    tc.append(tcpr)
    p = paragraph(
        [style_run(text, bold=bold, size_pt=10.5 if bold else 10.5)],
        style="TableText",
        align=align,
        before_pt=0,
        after_pt=0,
        line_pt=14,
        line_rule="auto",
        first_line_twips=0,
    )
    tc.append(p)
    return tc


def create_table(rows: list[list[str]], widths: list[int], header_fill: str | None = None) -> ET.Element:
    tbl = make_el(qn(W_NS, "tbl"))
    tblpr = make_el(qn(W_NS, "tblPr"))
    tblw = make_el(qn(W_NS, "tblW"), {qn(W_NS, "w"): str(sum(widths)), qn(W_NS, "type"): "dxa"})
    tblind = make_el(qn(W_NS, "tblInd"), {qn(W_NS, "w"): "0", qn(W_NS, "type"): "dxa"})
    tbllayout = make_el(qn(W_NS, "tblLayout"), {qn(W_NS, "type"): "fixed"})
    borders = make_el(qn(W_NS, "tblBorders"))
    for side in ("top", "left", "bottom", "right", "insideH", "insideV"):
        borders.append(make_el(qn(W_NS, side), {
            qn(W_NS, "val"): "single",
            qn(W_NS, "sz"): "8",
            qn(W_NS, "space"): "0",
            qn(W_NS, "color"): "666666",
        }))
    tblpr.extend([tblw, tblind, tbllayout, borders])
    tbl.append(tblpr)

    tblgrid = make_el(qn(W_NS, "tblGrid"))
    for width in widths:
        tblgrid.append(make_el(qn(W_NS, "gridCol"), {qn(W_NS, "w"): str(width)}))
    tbl.append(tblgrid)

    for row_idx, row in enumerate(rows):
        tr = make_el(qn(W_NS, "tr"))
        for idx, text in enumerate(row):
            tr.append(
                create_cell(
                    text,
                    widths[idx],
                    bold=(row_idx == 0),
                    fill=header_fill if row_idx == 0 else None,
                    align="center" if row_idx == 0 else "left",
                )
            )
        tbl.append(tr)
    return tbl


def create_footer_xml() -> bytes:
    ftr = make_el(qn(W_NS, "ftr"))
    ftr.append(page_number_field_para())
    return ET.tostring(ftr, encoding="utf-8", xml_declaration=True)


def create_styles_xml() -> bytes:
    styles = make_el(qn(W_NS, "styles"))

    docdefaults = make_el(qn(W_NS, "docDefaults"))
    rprdefault = make_el(qn(W_NS, "rPrDefault"))
    rpr = make_el(qn(W_NS, "rPr"))
    rpr.append(make_el(qn(W_NS, "rFonts"), {
        qn(W_NS, "ascii"): "Times New Roman",
        qn(W_NS, "hAnsi"): "Times New Roman",
        qn(W_NS, "eastAsia"): "SimSun",
        qn(W_NS, "cs"): "Times New Roman",
    }))
    rpr.append(make_el(qn(W_NS, "sz"), {qn(W_NS, "val"): "24"}))
    rpr.append(make_el(qn(W_NS, "szCs"), {qn(W_NS, "val"): "24"}))
    rprdefault.append(rpr)
    docdefaults.append(rprdefault)
    pprdefault = make_el(qn(W_NS, "pPrDefault"))
    ppr = make_el(qn(W_NS, "pPr"))
    ppr.append(make_el(qn(W_NS, "spacing"), {
        qn(W_NS, "before"): "0",
        qn(W_NS, "after"): "0",
        qn(W_NS, "line"): "400",
        qn(W_NS, "lineRule"): "exact",
    }))
    ppr.append(make_el(qn(W_NS, "ind"), {qn(W_NS, "firstLine"): "480"}))
    pprdefault.append(ppr)
    docdefaults.append(pprdefault)
    styles.append(docdefaults)

    def add_style(style_id: str, name: str, *, type_: str = "paragraph", based_on: str | None = "Normal", next_: str | None = "Normal", qformat: bool = True, outline: int | None = None, font_east: str = "SimSun", font_ascii: str = "Times New Roman", size_pt: float = 12, bold: bool = False, align: str | None = None, before_pt: float = 0, after_pt: float = 0, line_pt: float = 20, line_rule: str = "exact", first_line_twips: int = 480) -> None:
        s = make_el(qn(W_NS, "style"), {
            qn(W_NS, "type"): type_,
            qn(W_NS, "styleId"): style_id,
        })
        s.append(make_el(qn(W_NS, "name"), {qn(W_NS, "val"): name}))
        if based_on:
            s.append(make_el(qn(W_NS, "basedOn"), {qn(W_NS, "val"): based_on}))
        if next_:
            s.append(make_el(qn(W_NS, "next"), {qn(W_NS, "val"): next_}))
        if qformat:
            s.append(make_el(qn(W_NS, "qFormat")))
        ppr = make_el(qn(W_NS, "pPr"))
        if align:
            ppr.append(make_el(qn(W_NS, "jc"), {qn(W_NS, "val"): align}))
        ppr.append(make_el(qn(W_NS, "spacing"), {
            qn(W_NS, "before"): pt_to_twips(before_pt),
            qn(W_NS, "after"): pt_to_twips(after_pt),
            qn(W_NS, "line"): pt_to_twips(line_pt),
            qn(W_NS, "lineRule"): line_rule,
        }))
        if first_line_twips:
            ppr.append(make_el(qn(W_NS, "ind"), {qn(W_NS, "firstLine"): str(first_line_twips)}))
        if outline is not None:
            ppr.append(make_el(qn(W_NS, "outlineLvl"), {qn(W_NS, "val"): str(outline)}))
        s.append(ppr)
        rpr = make_el(qn(W_NS, "rPr"))
        rpr.append(make_el(qn(W_NS, "rFonts"), {
            qn(W_NS, "ascii"): font_ascii,
            qn(W_NS, "hAnsi"): font_ascii,
            qn(W_NS, "eastAsia"): font_east,
            qn(W_NS, "cs"): font_east,
        }))
        rpr.append(make_el(qn(W_NS, "sz"), {qn(W_NS, "val"): pt_to_halfpoints(size_pt)}))
        rpr.append(make_el(qn(W_NS, "szCs"), {qn(W_NS, "val"): pt_to_halfpoints(size_pt)}))
        if bold:
            rpr.append(make_el(qn(W_NS, "b")))
            rpr.append(make_el(qn(W_NS, "bCs")))
        s.append(rpr)
        styles.append(s)

    add_style("Normal", "Normal", size_pt=12, bold=False, align="both", before_pt=0, after_pt=0, line_pt=20, line_rule="exact", first_line_twips=480)
    add_style("CoverTitle", "CoverTitle", based_on="Normal", next_="Normal", size_pt=24, bold=True, align="center", before_pt=0, after_pt=18, line_pt=24, line_rule="auto", first_line_twips=0, font_east="SimHei")
    add_style("CoverInfo", "CoverInfo", based_on="Normal", next_="Normal", size_pt=16, bold=False, align="center", before_pt=0, after_pt=6, line_pt=22, line_rule="auto", first_line_twips=0)
    add_style("TOCTitle", "TOCTitle", based_on="Normal", next_="Normal", size_pt=22, bold=True, align="center", before_pt=24, after_pt=18, line_pt=22, line_rule="auto", first_line_twips=0, font_east="SimHei")
    add_style("Heading1", "Heading 1", based_on="Normal", next_="Normal", size_pt=22, bold=True, align="center", before_pt=24, after_pt=18, line_pt=20, line_rule="auto", first_line_twips=0, font_east="SimHei", outline=0)
    add_style("Heading2", "Heading 2", based_on="Normal", next_="Normal", size_pt=16, bold=True, align="left", before_pt=24, after_pt=6, line_pt=20, line_rule="auto", first_line_twips=0, font_east="SimHei", outline=1)
    add_style("Heading3", "Heading 3", based_on="Normal", next_="Normal", size_pt=16, bold=True, align="left", before_pt=24, after_pt=6, line_pt=20, line_rule="auto", first_line_twips=0, font_east="SimHei", outline=2)
    add_style("Caption", "Caption", based_on="Normal", next_="Normal", size_pt=10.5, bold=False, align="center", before_pt=6, after_pt=6, line_pt=14, line_rule="auto", first_line_twips=0)
    add_style("PageFooter", "PageFooter", based_on="Normal", next_="Normal", size_pt=10.5, bold=False, align="center", before_pt=0, after_pt=0, line_pt=14, line_rule="auto", first_line_twips=0)
    add_style("TableText", "TableText", based_on="Normal", next_="Normal", size_pt=10.5, bold=False, align="left", before_pt=0, after_pt=0, line_pt=14, line_rule="auto", first_line_twips=0)

    return ET.tostring(styles, encoding="utf-8", xml_declaration=True)


def create_settings_xml() -> bytes:
    settings = make_el(qn(W_NS, "settings"))
    settings.append(make_el(qn(W_NS, "updateFields"), {qn(W_NS, "val"): "true"}))
    return ET.tostring(settings, encoding="utf-8", xml_declaration=True)


def create_document_xml(body_children: list[ET.Element], sect_pr: ET.Element) -> bytes:
    document = make_el(qn(W_NS, "document"))
    body = make_el(qn(W_NS, "body"))
    for child in body_children:
        body.append(child)
    body.append(sect_pr)
    document.append(body)
    return ET.tostring(document, encoding="utf-8", xml_declaration=True)


def create_rels_xml(footer_rel: bool, image_count: int) -> bytes:
    rels = make_el(qn(PKG_REL_NS, "Relationships"))
    if footer_rel:
        rels.append(make_el(qn(PKG_REL_NS, "Relationship"), {
            "Id": "rIdFooter1",
            "Type": "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer",
            "Target": "footer1.xml",
        }))
    for idx in range(1, image_count + 1):
        rels.append(make_el(qn(PKG_REL_NS, "Relationship"), {
            "Id": f"rIdImg{idx}",
            "Type": "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
            "Target": f"media/image{idx}.svg",
        }))
    return ET.tostring(rels, encoding="utf-8", xml_declaration=True)


def create_root_rels() -> bytes:
    rels = make_el(qn(PKG_REL_NS, "Relationships"))
    rels.append(make_el(qn(PKG_REL_NS, "Relationship"), {
        "Id": "rId1",
        "Type": "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
        "Target": "word/document.xml",
    }))
    return ET.tostring(rels, encoding="utf-8", xml_declaration=True)


def create_content_types(image_count: int) -> bytes:
    types = make_el("Types")
    types.set("xmlns", "http://schemas.openxmlformats.org/package/2006/content-types")
    types.append(make_el("Default", {"Extension": "rels", "ContentType": "application/vnd.openxmlformats-package.relationships+xml"}))
    types.append(make_el("Default", {"Extension": "xml", "ContentType": "application/xml"}))
    types.append(make_el("Default", {"Extension": "svg", "ContentType": "image/svg+xml"}))
    types.append(make_el("Override", {
        "PartName": "/word/document.xml",
        "ContentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml",
    }))
    types.append(make_el("Override", {
        "PartName": "/word/styles.xml",
        "ContentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml",
    }))
    types.append(make_el("Override", {
        "PartName": "/word/settings.xml",
        "ContentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml",
    }))
    types.append(make_el("Override", {
        "PartName": "/word/footer1.xml",
        "ContentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml",
    }))
    return ET.tostring(types, encoding="utf-8", xml_declaration=True)


def svg_rect(x: int, y: int, w: int, h: int, fill: str, stroke: str = "#243b53", rx: int = 18, ry: int = 18, opacity: float = 1.0) -> str:
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="3" opacity="{opacity}"/>'


def svg_text(x: int, y: int, text: str, size: int = 28, fill: str = "#102a43", weight: str = "600", anchor: str = "start") -> str:
    return f'<text x="{x}" y="{y}" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{xml_escape(text)}</text>'


def svg_arrow(x1: int, y1: int, x2: int, y2: int, color: str = "#52606d") -> str:
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="4" marker-end="url(#arrow)"/>'


def svg_header(title: str, subtitle: str, bg: str = "#f8fafc") -> str:
    return f'''
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="760" viewBox="0 0 1400 760">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{bg}"/>
      <stop offset="100%" stop-color="#edf2f7"/>
    </linearGradient>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M0,0 L12,6 L0,12 z" fill="#52606d"/>
    </marker>
  </defs>
  <rect width="1400" height="760" fill="url(#bg)"/>
  <text x="70" y="82" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="36" font-weight="700" fill="#102a43">{xml_escape(title)}</text>
  <text x="70" y="124" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="20" fill="#486581">{xml_escape(subtitle)}</text>
'''


def svg_footer() -> str:
    return "</svg>"


def diagram_function_flow() -> bytes:
    parts = [svg_header("图2-1 功能需求数据流图", "浏览、筛选、购买、评测与后台管理的主链路均以 Rails 数据库为中心")]
    parts.append(svg_rect(560, 210, 280, 130, "#fff7ed", "#9c4221"))
    parts.append(svg_text(700, 266, "JX-Team 前端界面", 28, "#7c2d12", "700", "middle"))
    parts.append(svg_text(700, 304, "React / Redux / Router", 20, "#9a3412", "500", "middle"))
    parts.append(svg_rect(120, 200, 280, 120, "#eef2ff", "#3730a3"))
    parts.append(svg_text(260, 252, "游客 / 登录用户", 28, "#312e81", "700", "middle"))
    parts.append(svg_text(260, 290, "浏览、搜索、购买", 20, "#4338ca", "500", "middle"))
    parts.append(svg_rect(1000, 200, 280, 120, "#ecfeff", "#0f766e"))
    parts.append(svg_text(1140, 252, "管理员", 28, "#115e59", "700", "middle"))
    parts.append(svg_text(1140, 290, "内容维护与审核", 20, "#0f766e", "500", "middle"))
    parts.append(svg_rect(525, 440, 350, 130, "#f0fdf4", "#166534"))
    parts.append(svg_text(700, 492, "Rails API + PostgreSQL", 28, "#166534", "700", "middle"))
    parts.append(svg_text(700, 532, "games / reviews / purchases / admin", 20, "#15803d", "500", "middle"))
    parts.append(svg_rect(70, 455, 290, 100, "#fef2f2", "#b91c1c"))
    parts.append(svg_text(215, 515, "Node 抓取脚本 / 翻译代理", 22, "#991b1b", "700", "middle"))
    parts.append(svg_rect(1040, 455, 290, 100, "#f5f3ff", "#6d28d9"))
    parts.append(svg_text(1185, 515, "数据库种子 / 内容后台", 22, "#5b21b6", "700", "middle"))
    parts.append(svg_arrow(400, 260, 560, 260))
    parts.append(svg_arrow(840, 260, 1000, 260))
    parts.append(svg_arrow(260, 320, 560, 465))
    parts.append(svg_arrow(1140, 320, 840, 465))
    parts.append(svg_arrow(215, 455, 560, 470))
    parts.append(svg_arrow(1185, 455, 840, 470))
    parts.append(svg_text(700, 640, "核心数据路径：前端请求接口 -> Rails 处理 -> PostgreSQL 读取 / 写入 -> 前端渲染", 22, "#334e68", "500", "middle"))
    parts.append(svg_footer())
    return "".join(parts).encode("utf-8")


def diagram_use_case() -> bytes:
    parts = [svg_header("图2-2 核心用例图", "校园主题游戏平台围绕“浏览-购买-入库-评测”形成闭环")]
    parts.append(svg_rect(470, 210, 460, 290, "#ffffff", "#334e68", rx=26, ry=26))
    parts.append(svg_text(700, 262, "系统用例", 32, "#102a43", "700", "middle"))
    use_cases = [
        ("浏览首页 / 精选", 220, 200, "#eff6ff"),
        ("筛选游戏 / 搜索", 160, 300, "#eff6ff"),
        ("查看详情 / 截图", 220, 400, "#eff6ff"),
        ("购物车 / 愿望单", 990, 200, "#fef3c7"),
        ("购买入库", 1040, 300, "#fef3c7"),
        ("发表评测", 990, 400, "#fef3c7"),
    ]
    for label, x, y, fill in use_cases:
        parts.append(svg_rect(x, y, 200, 78, fill, "#52606d", rx=18, ry=18))
        parts.append(svg_text(x + 100, y + 48, label, 22, "#102a43", "600", "middle"))
    parts.append(svg_rect(80, 220, 120, 90, "#dbeafe", "#1d4ed8", rx=18, ry=18))
    parts.append(svg_text(140, 270, "游客/用户", 22, "#1d4ed8", "700", "middle"))
    parts.append(svg_rect(1180, 220, 140, 90, "#dcfce7", "#15803d", rx=18, ry=18))
    parts.append(svg_text(1250, 270, "管理员", 24, "#15803d", "700", "middle"))
    parts.append(svg_arrow(200, 265, 470, 265))
    parts.append(svg_arrow(280, 320, 470, 330))
    parts.append(svg_arrow(280, 265, 470, 430))
    parts.append(svg_arrow(930, 265, 990, 265))
    parts.append(svg_arrow(990, 330, 930, 330))
    parts.append(svg_arrow(930, 430, 990, 430))
    parts.append(svg_text(700, 575, "关键约束：只有已购买的游戏才能发表用户评测；游戏实体、评论与购买记录统一由数据库维护。", 22, "#334e68", "500", "middle"))
    parts.append(svg_footer())
    return "".join(parts).encode("utf-8")


def diagram_er() -> bytes:
    parts = [svg_header("图2-3 数据实体关系图", "数据库围绕用户、游戏、评论、购买、标签与后台内容构建")]
    entities = [
        ("User", 120, 170, "#dbeafe", "#1d4ed8"),
        ("Game", 410, 120, "#fff7ed", "#c2410c"),
        ("Review", 720, 170, "#ecfccb", "#3f6212"),
        ("Purchase", 1040, 120, "#fce7f3", "#be185d"),
        ("Genre", 360, 430, "#ede9fe", "#6d28d9"),
        ("Tag", 640, 430, "#e0f2fe", "#0284c7"),
        ("NewsItem", 930, 430, "#fef3c7", "#b45309"),
        ("CuratorPick", 1170, 430, "#dcfce7", "#15803d"),
    ]
    for label, x, y, fill, stroke in entities:
        parts.append(svg_rect(x, y, 180, 90, fill, stroke, rx=22, ry=22))
        parts.append(svg_text(x + 90, y + 55, label, 28, stroke, "700", "middle"))
    relations = [
        (300, 215, 410, 165),  # User -> Game
        (590, 165, 720, 215),  # Game -> Review
        (590, 165, 1040, 165),  # Game -> Purchase
        (500, 210, 450, 430),  # Game -> Genre
        (590, 210, 640, 430),  # Game -> Tag
        (770, 260, 1020, 430),  # Review -> News
        (1120, 260, 1210, 430),  # Purchase -> Curator
    ]
    for x1, y1, x2, y2 in relations:
        parts.append(svg_arrow(x1, y1, x2, y2))
    parts.append(svg_text(700, 610, "核心业务规则：用户拥有购买记录后才可评测；游戏可挂载多个标签与分类；新闻、推荐和后台内容通过 game_id 关联。", 20, "#334e68", "500", "middle"))
    parts.append(svg_footer())
    return "".join(parts).encode("utf-8")


def diagram_architecture() -> bytes:
    parts = [svg_header("图3-1 软件架构设计图", "前端、后端、数据库与脚本工具的职责边界清晰")]
    parts.append(svg_rect(90, 220, 220, 120, "#eef2ff", "#4338ca"))
    parts.append(svg_text(200, 272, "浏览器 / WebView", 28, "#312e81", "700", "middle"))
    parts.append(svg_text(200, 310, "PC / 移动端", 20, "#4338ca", "500", "middle"))
    parts.append(svg_rect(380, 180, 300, 180, "#fff7ed", "#c2410c"))
    parts.append(svg_text(530, 240, "React 17 + Redux", 30, "#9a3412", "700", "middle"))
    parts.append(svg_text(530, 282, "页面、状态、路由", 20, "#c2410c", "500", "middle"))
    parts.append(svg_text(530, 314, "本地化、交互动画", 20, "#c2410c", "500", "middle"))
    parts.append(svg_rect(760, 180, 300, 180, "#f0fdf4", "#166534"))
    parts.append(svg_text(910, 240, "Rails 5.2 API", 30, "#166534", "700", "middle"))
    parts.append(svg_text(910, 282, "认证 / 购买 / 评测 / 后台", 20, "#15803d", "500", "middle"))
    parts.append(svg_text(910, 314, "Jbuilder 输出 JSON", 20, "#15803d", "500", "middle"))
    parts.append(svg_rect(1110, 220, 210, 120, "#ecfeff", "#0f766e"))
    parts.append(svg_text(1215, 272, "PostgreSQL", 28, "#0f766e", "700", "middle"))
    parts.append(svg_text(1215, 310, "主数据真源", 20, "#0f766e", "500", "middle"))
    parts.append(svg_rect(400, 430, 240, 110, "#fef3c7", "#b45309"))
    parts.append(svg_text(520, 480, "Node.js 脚本", 26, "#92400e", "700", "middle"))
    parts.append(svg_text(520, 510, "抓取 / 测试 / 生成", 18, "#b45309", "500", "middle"))
    parts.append(svg_rect(780, 430, 280, 110, "#fce7f3", "#be185d"))
    parts.append(svg_text(920, 480, "翻译代理与占位策略", 24, "#9d174d", "700", "middle"))
    parts.append(svg_text(920, 510, "DeepSeek 代理接口", 18, "#be185d", "500", "middle"))
    parts.append(svg_arrow(310, 280, 380, 280))
    parts.append(svg_arrow(680, 280, 760, 280))
    parts.append(svg_arrow(1060, 280, 1110, 280))
    parts.append(svg_arrow(530, 360, 530, 430))
    parts.append(svg_arrow(910, 360, 920, 430))
    parts.append(svg_arrow(1120, 430, 990, 360))
    parts.append(svg_text(700, 610, "设计目标：让页面只负责展示与交互，业务规则沉到 Rails，持久化数据统一沉到 PostgreSQL。", 20, "#334e68", "500", "middle"))
    parts.append(svg_footer())
    return "".join(parts).encode("utf-8")


def diagram_flow() -> bytes:
    parts = [svg_header("图3-2 业务流程设计图", "从浏览到购买再到评测，形成可连续演示的业务闭环")]
    flow = [
        ("1", "首页浏览", 70, 260, "#eff6ff", "#1d4ed8"),
        ("2", "进入详情", 280, 260, "#fff7ed", "#c2410c"),
        ("3", "加入购物车", 490, 260, "#fef3c7", "#b45309"),
        ("4", "完成购买", 700, 260, "#dcfce7", "#15803d"),
        ("5", "进入库存", 910, 260, "#e0f2fe", "#0284c7"),
        ("6", "发表评测", 1120, 260, "#fce7f3", "#be185d"),
    ]
    for no, label, x, y, fill, stroke in flow:
        parts.append(svg_rect(x, y, 160, 120, fill, stroke, rx=22, ry=22))
        parts.append(svg_text(x + 80, y + 42, no, 22, stroke, "700", "middle"))
        parts.append(svg_text(x + 80, y + 82, label, 24, stroke, "700", "middle"))
    for x1, x2 in [(230, 280), (440, 490), (650, 700), (860, 910), (1070, 1120)]:
        parts.append(svg_arrow(x1, 320, x2, 320))
    parts.append(svg_text(700, 500, "后台侧则围绕“内容维护-数据回写-再次演示”循环，保证课堂展示内容始终可更新。", 22, "#334e68", "500", "middle"))
    parts.append(svg_footer())
    return "".join(parts).encode("utf-8")


def diagram_home_mock() -> bytes:
    parts = [svg_header("图4-1 首页界面效果示意", "校园主题首页保留 Steam 结构，但在视觉上收束为更安静的商店式布局", "#fffaf0")]
    parts.append(svg_rect(60, 160, 168, 540, "#4c1d1d", "#4c1d1d", rx=26, ry=26))
    parts.append(svg_text(144, 220, "JX-Team", 24, "#f5e6ca", "700", "middle"))
    parts.append(svg_text(144, 260, "NAV", 18, "#fef3c7", "500", "middle"))
    parts.append(svg_text(144, 300, "BROWSE", 18, "#fef3c7", "500", "middle"))
    parts.append(svg_text(144, 340, "COMMUNITY", 18, "#fef3c7", "500", "middle"))
    parts.append(svg_rect(270, 170, 820, 300, "#7f1d1d", "#7f1d1d", rx=24, ry=24))
    parts.append(svg_rect(290, 190, 440, 240, "#fde68a", "#b45309", rx=18, ry=18))
    parts.append(svg_text(510, 320, "精选轮播", 30, "#7c2d12", "700", "middle"))
    parts.append(svg_rect(760, 190, 300, 90, "#9f1239", "#9f1239", rx=14, ry=14))
    parts.append(svg_rect(760, 290, 300, 90, "#be123c", "#be123c", rx=14, ry=14))
    parts.append(svg_text(910, 245, "游戏名 / 价格 / 标签", 22, "#fff1f2", "600", "middle"))
    parts.append(svg_text(910, 345, "推荐 / 用户评测 / 平台", 22, "#fff1f2", "600", "middle"))
    parts.append(svg_rect(270, 500, 530, 180, "#7c2d12", "#7c2d12", rx=24, ry=24))
    parts.append(svg_text(335, 545, "浏览卡片列表", 26, "#fff7ed", "700", "start"))
    parts.append(svg_rect(300, 570, 110, 90, "#fed7aa", "#c2410c", rx=14, ry=14))
    parts.append(svg_rect(425, 570, 110, 90, "#fdba74", "#c2410c", rx=14, ry=14))
    parts.append(svg_rect(550, 570, 110, 90, "#fb923c", "#c2410c", rx=14, ry=14))
    parts.append(svg_rect(760, 500, 330, 180, "#fca5a5", "#b91c1c", rx=24, ry=24))
    parts.append(svg_text(925, 546, "专题推荐卡片", 26, "#7f1d1d", "700", "middle"))
    parts.append(svg_text(925, 586, "支持标签、折扣和截图", 20, "#991b1b", "500", "middle"))
    parts.append(svg_footer())
    return "".join(parts).encode("utf-8")


def diagram_detail_mock() -> bytes:
    parts = [svg_header("图4-2 详情页与购买链路示意", "详情页整合截图、配置、评测、加入购物车与愿望单")]
    parts.append(svg_rect(70, 140, 820, 240, "#4c1d1d", "#4c1d1d", rx=24, ry=24))
    parts.append(svg_rect(92, 165, 490, 190, "#f59e0b", "#c2410c", rx=16, ry=16))
    parts.append(svg_text(337, 260, "游戏大图 / 截图阵列", 30, "#431407", "700", "middle"))
    parts.append(svg_rect(610, 165, 250, 72, "#7f1d1d", "#7f1d1d", rx=14, ry=14))
    parts.append(svg_text(735, 208, "购买条 + 按钮区", 22, "#fff7ed", "700", "middle"))
    parts.append(svg_rect(610, 248, 250, 72, "#7f1d1d", "#7f1d1d", rx=14, ry=14))
    parts.append(svg_text(735, 292, "用户评测 / 配置", 22, "#fff7ed", "700", "middle"))
    parts.append(svg_rect(100, 430, 320, 230, "#fef3c7", "#b45309", rx=22, ry=22))
    parts.append(svg_text(260, 470, "游戏简介", 26, "#92400e", "700", "middle"))
    parts.append(svg_text(260, 515, "开发商 / 发行商 / 标签", 20, "#b45309", "500", "middle"))
    parts.append(svg_rect(460, 430, 540, 230, "#fce7f3", "#be185d", rx=22, ry=22))
    parts.append(svg_text(730, 468, "评测区与库存状态", 26, "#9d174d", "700", "middle"))
    parts.append(svg_text(730, 516, "购买后可写评测；未购买时给出引导", 20, "#be185d", "500", "middle"))
    parts.append(svg_arrow(880, 525, 1000, 525))
    parts.append(svg_footer())
    return "".join(parts).encode("utf-8")


def diagram_admin_mock() -> bytes:
    parts = [svg_header("图4-3 后台管理界面示意", "后台采用轻量化控制台，面向内容维护、统计与审核")]
    parts.append(svg_rect(70, 150, 230, 520, "#111827", "#111827", rx=24, ry=24))
    parts.append(svg_text(185, 220, "Admin", 28, "#f9fafb", "700", "middle"))
    for idx, label in enumerate(["Dashboard", "Games", "Genres", "Tags", "News", "Users", "Reviews"], start=0):
        parts.append(svg_text(185, 280 + idx * 52, label, 20, "#d1d5db", "500", "middle"))
    parts.append(svg_rect(340, 150, 990, 160, "#eff6ff", "#2563eb", rx=24, ry=24))
    parts.append(svg_text(835, 215, "数据统计卡片", 32, "#1d4ed8", "700", "middle"))
    parts.append(svg_text(835, 255, "游戏数量 / 评测数量 / 购买数量 / 活跃用户", 20, "#2563eb", "500", "middle"))
    parts.append(svg_rect(340, 340, 470, 330, "#ecfdf5", "#16a34a", rx=24, ry=24))
    parts.append(svg_text(575, 386, "内容列表", 28, "#166534", "700", "middle"))
    parts.append(svg_text(575, 440, "游戏 / 新闻 / 标签 / 鉴赏家", 20, "#16a34a", "500", "middle"))
    parts.append(svg_rect(850, 340, 480, 330, "#fef3c7", "#b45309", rx=24, ry=24))
    parts.append(svg_text(1090, 386, "编辑面板", 28, "#92400e", "700", "middle"))
    parts.append(svg_text(1090, 440, "创建、更新、删除、审核", 20, "#b45309", "500", "middle"))
    parts.append(svg_footer())
    return "".join(parts).encode("utf-8")


def build_body() -> tuple[list[ET.Element], list[tuple[str, bytes, float, float]]]:
    children: list[ET.Element] = []
    images: list[tuple[str, bytes, float, float]] = []

    def add(text: str, **kwargs) -> None:
        children.append(body_para(text, **kwargs))

    def addh1(text: str) -> None:
        children.append(heading_para(text, style="Heading1", level=0, align="center", size_pt=22, before_pt=24, after_pt=18))

    def addh2(text: str) -> None:
        children.append(heading_para(text, style="Heading2", level=1, align="left", size_pt=16, before_pt=24, after_pt=6))

    def addh3(text: str) -> None:
        children.append(heading_para(text, style="Heading3", level=2, align="left", size_pt=16, before_pt=24, after_pt=6))

    def add_fig(caption: str, svg_bytes: bytes, width_in: float = 6.25, height_in: float = 3.4) -> None:
        idx = len(images) + 1
        name = f"image{idx}.svg"
        images.append((name, svg_bytes, width_in, height_in))
        children.append(image_para(f"rIdImg{idx}", name, width_in, height_in))
        children.append(caption_para(caption))

    def add_table(rows: list[list[str]], widths: list[int], caption: str, header_fill: str | None = None) -> None:
        children.append(caption_para(caption))
        children.append(create_table(rows, widths, header_fill=header_fill))
        children.append(blank_para(6))

    # Chapter 1
    addh1("第1章 绪论")
    add("JX-Team 是一个面向课程演示与作业提交的校园主题游戏商店项目。项目参考主流游戏平台的信息组织方式，但把品牌、内容与交互都收束到校园作品语境中，同时把游戏主链路统一到 Rails 数据库，避免前端运行时继续直读本地 JSON 带来的双源问题。")
    add("从课程目标看，这个项目既要像一个能讲清楚的完整产品，也要像一套能被零基础同学继续维护的工程模板。因此，本文不仅描述功能本身，也强调数据来源、接口设计、后台维护和部署文档的完整性。")
    addh2("1.1 研究现状")
    add("当前数字游戏商店已经从“单纯卖游戏”演化为“内容分发、用户关系、社区互动和运营维护”并重的平台。用户在浏览一款游戏时，往往同时关心截图、分类、测评、价格、配置和是否支持手柄；而课程项目则更需要把这些信息组织成清晰的演示链路。")
    add("与成熟平台相比，课堂项目的难点不在于功能数量，而在于如何在有限时间内把浏览、购买、库存、评测和后台管理串成闭环，并保持前端界面足够统一、数据结构足够稳定、说明文档足够清楚。")
    addh2("1.2 开发背景")
    add("本项目以 Steam 风格的信息架构为参考，同时引入江西师范大学校园品牌元素，使作品既有平台感，也有课程作品的辨识度。项目早期通过抓取脚本积累了游戏 catalog，后续再通过 Rails seed 导入数据库，逐步把原本分散的静态资源收拢为可维护的数据模型。")
    add("随着功能扩展，前端页面越来越依赖统一数据源和统一本地化逻辑，因此需要把接口、翻译、校徽品牌、后台内容和部署教程一起整理，形成可交接、可复现、可演示的完整工程。")
    addh2("1.3 项目意义")
    add("对课程作业而言，本项目的意义主要体现在三点：第一，能够完整展示 Web 应用从数据导入、接口输出到页面渲染的全链路；第二，能够体现前后端协作、接口设计和数据库建模的综合能力；第三，能够让后续接手的同学直接基于现有文档复现环境，减少重复沟通成本。")
    add("对团队实践而言，这个项目帮助大家在真实约束下理解 React、Rails、Redux、Webpack、PostgreSQL 之间的分工，也进一步训练了内容收束、页面统一和多语言适配的能力。")
    addh2("1.4 项目目标")
    add("项目目标不是做一个简单的仿站，而是做一个能够演示、能够维护、能够继续扩展的校园主题商店系统。具体包括：实现首页浏览、游戏筛选、详情查看、加入购物车、加入愿望单、购买入库、发表评测、后台管理与本地化切换等主流程，并把这些流程固化到数据库与 API 之中。")
    addh2("1.5 主要工作内容")
    add("项目已完成的主要工作包括：将 197 款游戏从 `src/mock/games.json` 导入 PostgreSQL；将前端商品读取统一改为 API 封装；补齐登录、购买、库存、评测、统计、新闻、鉴赏家和后台管理等页面；完善部署、技术栈、演示流程、分工和交接文档。")
    addh2("1.6 研究方法")
    add("本文采用结构化分析与面向对象设计相结合的方法：先从功能需求和数据需求入手，建立实体关系与业务流程；再采用模块化、组件化的方式实现前后端页面；最后通过种子数据、接口测试和本地联调进行迭代验证。")
    addh2("1.7 文档组织结构")
    add("全文共分五章。第 1 章说明研究背景、意义与方法；第 2 章完成需求分析；第 3 章给出系统设计；第 4 章描述功能实现；第 5 章总结现状并提出后续优化方向。")

    # Chapter 2
    children.append(page_break_para())
    addh1("第2章 项目分析")
    add("本章从功能需求、非功能性需求和数据需求三个层面分析系统应当具备的核心能力。考虑到课程展示的连续性，分析重点放在主链路是否闭环、数据是否统一，以及页面是否能稳定地支持后续接手。")
    addh2("2.1 功能需求")
    add("系统的核心功能可以概括为“看得到、买得起、存得住、评得了”。用户首先通过首页和浏览页看到精选内容，再通过分类、标签、开发商、发行商等条件筛选游戏；进入详情页后，可以查看截图、简介、价格、配置、推荐标签和评测区；购买后游戏进入库存，并解锁评测能力。")
    add_fig("图2-1 功能需求数据流图", diagram_function_flow(), 6.25, 3.4)
    add_fig("图2-2 核心用例图", diagram_use_case(), 6.25, 3.4)
    add_table(
        [
            ["功能项", "主要说明", "对应页面 / 接口"],
            ["首页浏览", "展示精选、推荐与入口", "首页、/api/games/featured"],
            ["浏览筛选", "按 genre、tag、developer、publisher、filter 浏览", "/browse /api/games"],
            ["详情查看", "展示截图、简介、价格、配置、标签", "/api/games/:id"],
            ["购买入库", "完成购物车购买并写入库存", "/api/purchases"],
            ["用户评测", "已购买用户发表推荐 / 不推荐评测", "/api/games/:id/reviews"],
            ["后台管理", "维护新闻、标签、鉴赏家与统计", "/api/admin/*"],
        ],
        [2200, 4000, 2826],
        "表2-1 功能需求与实现映射",
        header_fill="E8EEF5",
    )
    addh2("2.2 非功能性需求")
    add("非功能性需求主要包括：一是界面加载要稳定，不能因为某些图片缺失就让页面空白；二是布局要适配常见屏幕尺寸，避免横向溢出和左右失衡；三是多语言切换要保持结构不乱，中文模式下不能残留大量英文按钮或标题；四是代码和文档要便于后续维护，尽量减少双源和临时补丁。")
    add("此外，系统还需要具备基本的安全性与可恢复性。登录态、购买记录和评测数据都应由后端统一控制，重要页面要有空状态、加载态和错误态，方便现场演示时及时解释。")
    addh2("2.3 数据需求")
    add("系统的数据需求集中在三类实体：一类是用户和购买记录，用于支撑登录、库存与评测；一类是游戏主数据，用于支撑浏览、筛选、详情和推荐；另一类是运营内容，用于支撑新闻、鉴赏家、统计和后台管理。当前 catalog 共导入 197 款游戏，数据源已经统一收口到数据库。")
    add_fig("图2-3 数据实体关系图", diagram_er(), 6.25, 3.4)
    add_table(
        [
            ["实体", "核心字段", "主要关系", "说明"],
            ["User", "username / email / admin", "1 对多 Review / Purchase", "承载登录与权限"],
            ["Game", "title / price / featured / genre", "1 对多 Review / Purchase / Image", "游戏主实体"],
            ["Review", "author_id / game_id / recommended", "belongs to User 和 Game", "用户评测"],
            ["Purchase", "buyerId / gameId", "belongs to User 和 Game", "购买记录"],
            ["Tag / Genre", "slug / name", "多对多 Game", "筛选与分类"],
            ["NewsItem / CuratorPick", "title / summary / position", "belongs to Game", "运营内容"],
        ],
        [1400, 3000, 2600, 2026],
        "表2-2 主要数据实体与关系",
        header_fill="E8EEF5",
    )

    # Chapter 3
    children.append(page_break_para())
    addh1("第3章 项目设计")
    add("本章从架构、模块、流程、接口和数据库五个层面说明系统的设计方法。设计原则是把可变内容交给数据库，把交互逻辑交给前端，把业务规则交给 Rails，让每一层都只做自己最擅长的事情。")
    addh2("3.1 软件架构设计")
    add("系统采用典型的前后端分离式单页应用结构：浏览器端由 React 负责渲染，Redux 负责共享状态，React Router 负责页面切换；Rails 负责鉴权、业务计算、购买、评测、后台和翻译代理；PostgreSQL 负责保存主数据；Node.js 脚本负责抓取、测试和辅助生成。")
    add_fig("图3-1 软件架构设计图", diagram_architecture(), 6.25, 3.4)
    add_table(
        [
            ["层级", "技术栈", "职责", "选择理由"],
            ["前端展示层", "React 17 + Router + Redux", "页面渲染与状态管理", "组件化清晰，便于页面拆分"],
            ["业务服务层", "Rails 5.2", "API、认证、后台、翻译代理", "MVC 与路由能力成熟"],
            ["数据持久层", "PostgreSQL", "用户、游戏、评测、购买", "关系与事务更适合电商式业务"],
            ["构建层", "Webpack 5", "打包前端资源", "和旧版 Rails 项目兼容性好"],
            ["辅助层", "Node.js 脚本", "抓取和文案测试", "批量处理更方便"],
        ],
        [1700, 2600, 2600, 2126],
        "表3-1 技术栈与职责划分",
        header_fill="E8EEF5",
    )
    addh2("3.2 软件模块设计")
    add("前端主要拆分为首页与导航模块、浏览筛选模块、游戏详情模块、购物车与愿望单模块、评测模块、统计与静态演示模块、以及后台管理模块。后端主要拆分为游戏接口、用户与会话、评测与购买、统计与内容、翻译代理和后台管理六个子域。")
    addh3("3.2.1 前端模块")
    add("前端模块强调页面复用与细粒度交互。首页与详情页共用游戏实体卡片、标签、评分和截图渲染逻辑，公共导航、语言切换和按钮状态也做成统一组件，避免每个页面各写一套样式。")
    addh3("3.2.2 后端模块")
    add("后端模块强调数据一致性。游戏、评测、购买、新闻、鉴赏家和后台编辑都围绕同一组主键运转，避免页面使用的 ID 与数据库中的 ID 脱节。")
    addh2("3.3 业务流程设计")
    add("系统的主业务流程可以概括为：用户先浏览首页或浏览页，再进入详情页查看内容，然后把游戏加入购物车或愿望单；登录后完成购买，游戏进入库存；用户在库存中回到详情页发表评测，形成完整闭环。")
    add_fig("图3-2 业务流程设计图", diagram_flow(), 6.25, 3.4)
    addh2("3.4 接口设计")
    add("接口设计遵循“列表入口统一、详情字段统一、行为接口独立”的原则。游戏列表统一由 `GET /api/games` 提供，并支持 `featured`、`genre`、`developer`、`publisher`、`tag`、`sort=new`、`filter=upcoming|specials|controller` 等筛选。详情由 `GET /api/games/:id` 提供，评测由 `GET /api/games/:id/reviews` 和 `POST /api/games/:id/reviews` 提供，购买由 `POST /api/purchases` 提供。")
    add("后台接口统一放在 `/api/admin/*` 下，方便后续继续扩充；翻译功能则通过 `/api/translate` 代理外部翻译服务，在未配置 Key 时返回占位译文，保证演示不中断。")
    add_table(
        [
            ["接口", "方法", "用途", "备注"],
            ["/api/games", "GET", "游戏列表与筛选", "主入口"],
            ["/api/games/:id", "GET", "单个游戏详情", "含截图与标签"],
            ["/api/games/featured", "GET", "精选首页", "轮播与推荐"],
            ["/api/games/:id/reviews", "GET / POST", "查看与提交评测", "POST 仅限已购买"],
            ["/api/purchases", "POST", "购买入库", "写入库存"],
            ["/api/admin/games", "GET / PATCH", "后台游戏管理", "示例性内容维护"],
        ],
        [2100, 1100, 2900, 2926],
        "表3-2 主要接口设计",
        header_fill="E8EEF5",
    )
    addh2("3.5 数据库设计")
    add("数据库设计遵循“主表稳定、关系表清晰、种子可重建”的思路。游戏表承担主数据，标签和分类通过关联表扩展，评测和购买记录通过外键连接用户与游戏，运营内容则通过 game_id 关联到具体游戏。")
    addh3("3.5.1 主表设计")
    add("主表中 `games` 记录游戏标题、简介、开发商、发行商、价格、发布日期、是否精选、分类、是否支持手柄以及折扣价；`users` 记录登录、权限与会话；`reviews` 与 `purchases` 记录用户行为。")
    addh3("3.5.2 关系设计")
    add("关联表 `game_tags`、`game_genres` 用于多对多扩展，保证一个游戏能同时对应多个标签和分类。`game_images` 用于保存截图和胶囊图，`news_items`、`curator_picks` 用于展示课堂演示中的运营内容。")

    # Chapter 4
    children.append(page_break_para())
    addh1("第4章 项目实现")
    add("本章结合界面效果图和代码位置说明系统如何落地。实现重点不在于堆叠页面数量，而在于让首页、详情、购买、评测、后台和文档形成统一体验，避免出现“能跑但不好讲”的情况。")
    addh2("4.1 首页与导航实现")
    add("首页采用左侧导航 + 右侧主内容的双栏结构，保留平台式信息密度，同时通过更收束的色彩和按钮样式降低视觉噪音。当前页面会把多语言切换、安装按钮与登录入口统一到顶部区域，并尽量避免按钮和文字发生错位。")
    add_fig("图4-1 首页界面效果示意", diagram_home_mock(), 6.25, 3.4)
    addh3("4.1.1 顶栏与品牌位")
    add("顶栏负责站点标识、多语言切换、安装入口和登录入口。学校品牌元素与项目名共同构成站点识别，避免页面完全像原始 Steam 仿站。")
    addh3("4.1.2 精选轮播与浏览入口")
    add("精选轮播从 `/api/games/featured` 读取数据，旁边的浏览卡片与专题推荐卡片则把“看什么、怎么找、去哪点”这三件事集中在首页上，方便课堂现场快速演示。")
    addh2("4.2 浏览与筛选实现")
    add("浏览页统一走 `GET /api/games`，前端再按 `featured`、`genre`、`developer`、`publisher`、`tag`、`sort=new` 等参数构造筛选条件。这样既可以演示分类浏览，也能避免游戏数据在前端被写死。")
    add("为了保证中文模式下不再残留大量英文入口，当前多语言映射把侧边栏、按钮、空状态和通用链接都纳入翻译范围，减少“游戏内容翻译了，界面标题却还是英文”的割裂感。")
    addh2("4.3 详情页与购买链路")
    add("详情页是整个项目的核心页面，承载了截图、简介、配置、标签、开发商、发行商、购买条、评测区和相似推荐等信息。购买按钮和愿望单按钮采用统一的嵌入式视觉处理，避免按钮中间出现突兀的底色或不一致的字体颜色。")
    add_fig("图4-2 详情页与购买链路示意", diagram_detail_mock(), 6.25, 3.4)
    add("购买完成后，页面会根据库存状态更新评测区的显示方式，确保“未购买不能评论、已购买可以评论”的规则能直接在界面上看出来。")
    addh2("4.4 评测、库存与愿望单")
    add("评测区既展示系统默认的推荐内容，也展示真实用户评测。库存页用于确认购买结果，愿望单则用于记录用户的意向收藏。当前这些页面都围绕同一套游戏 ID 运转，因此不会再出现过去那种 mock ID 与数据库 ID 混用的问题。")
    addh2("4.5 后台管理与内容维护")
    add("后台管理采用轻量化设计，重点放在游戏、标签、新闻、鉴赏家、用户和评测的维护上，不追求复杂权限系统，而是让老师和队友在演示阶段能一眼看懂操作入口和数据变化。")
    add_fig("图4-3 后台管理界面示意", diagram_admin_mock(), 6.25, 3.4)
    add("后台页面同时承担内容整理和验收的作用：一方面可以补充演示数据，另一方面可以帮助接手者确认哪些功能已经联通，哪些功能仍在计划中。")
    addh2("4.6 部署与文档支撑")
    add("为了降低交接门槛，项目已经补齐部署教程、演示流程、技术栈说明、分工说明和未完成事项收束文档。对零基础同学来说，只要按教程执行 `bundle install`、`npm install`、`bundle exec rails db:setup` 和前端构建命令，就可以先把站点跑起来，再慢慢理解模块内部的关联。")
    add("这一套文档的目标不是“把所有细节讲完”，而是让接手者先知道项目结构、知道从哪里启动、知道从哪几个页面演示、知道问题出在哪一层。")
    add_table(
        [
            ["页面 / 模块", "对应位置", "当前实现要点"],
            ["首页", "frontend/components/games/featured/*", "精选轮播、分类入口、统一导航"],
            ["详情页", "frontend/components/games/show/*", "截图、购买条、配置、评测"],
            ["评测页", "frontend/components/reviews/*", "推荐 / 不推荐、购买后可评论"],
            ["后台页", "frontend/components/admin/*", "内容维护与统计"],
            ["部署文档", "部署教程.md / README.md", "零基础启动步骤"],
        ],
        [2200, 3000, 3826],
        "表4-1 主要页面与实现位置",
        header_fill="E8EEF5",
    )

    # Chapter 5
    children.append(page_break_para())
    addh1("第5章 总结与展望")
    add("项目最终把校园主题、Steam 风格信息架构、数据库真源、前后端联动和本地化能力统一到同一条主链路中，形成了一套可以直接演示的课程作品。基于 Rails、React、Redux、Router、Webpack 和 PostgreSQL 的组合，系统完成了首页浏览、分类筛选、详情展示、购买入库、愿望单、评测和后台管理等核心功能。")
    addh2("5.1 总结")
    add("从实现结果来看，项目最大的收获不是单个页面做得多复杂，而是把零散的 mock 数据、接口和样式统一成一套可维护的工程结构。数据库成为唯一真源之后，前端页面的更新逻辑更清晰，评测、购买和库存也终于能够围绕同一批游戏实体工作。")
    add("从协作角度看，分工文档、部署文档和演示流程文档已经让项目具备交接条件；从表达角度看，校园校徽、品牌色和界面动效也让整个作品更像一个完整的课程成果，而不是简单的技术堆砌。")
    addh2("5.2 不足与展望")
    add("当前项目仍有进一步优化空间：第一，中文化覆盖仍可以继续补全，尤其是侧边栏、链接按钮和个别页面标题；第二，后台管理仍属于轻量版，后续可以继续做成更完整的内容运营面板；第三，Steam 抓取脚本和推荐逻辑还可以继续提高准确性，减少误命中；第四，移动端和低分辨率下的适配还能继续细化。")
    add("后续如果继续迭代，可以考虑引入更完整的权限控制、实时搜索、个性化推荐、后台统计图表和更完善的多语言资源管理，使项目从“课堂可演示”逐步走向“课程作品可复用”。")

    # References
    children.append(page_break_para())
    addh1("参考文献")
    refs = [
        "[1] JX-Team 项目组. JX-Team 项目 README[EB/OL]. 本地仓库文档.",
        "[2] Ruby on Rails Core Team. Ruby on Rails Guides[EB/OL]. https://guides.rubyonrails.org/",
        "[3] Meta. React Documentation[EB/OL]. https://react.dev/",
        "[4] PostgreSQL Global Development Group. PostgreSQL 16 Documentation[EB/OL]. https://www.postgresql.org/docs/",
        "[5] webpack contributors. webpack Documentation[EB/OL]. https://webpack.js.org/",
        "[6] Node.js Contributors. Node.js Documentation[EB/OL]. https://nodejs.org/en/docs",
    ]
    for ref in refs:
        children.append(body_para(ref, align="left", before_pt=0, after_pt=0, line_pt=18, first_line_twips=0))

    return children, images


def image_para(rel_id: str, name: str, width_in: float, height_in: float) -> ET.Element:
    match = re.search(r"(\d+)$", rel_id)
    pic_id = match.group(1) if match else "1"
    p = paragraph([], style="Normal", align="center", before_pt=6, after_pt=0, line_pt=1, line_rule="auto", first_line_twips=0)
    run = make_el(qn(W_NS, "r"))
    drawing = make_el(qn(W_NS, "drawing"))
    inline = make_el(qn(WP_NS, "inline"), {"distT": "0", "distB": "0", "distL": "0", "distR": "0"})
    inline.append(make_el(qn(WP_NS, "extent"), {"cx": inches_to_emu(width_in), "cy": inches_to_emu(height_in)}))
    inline.append(make_el(qn(WP_NS, "docPr"), {"id": pic_id, "name": name}))
    c_nv = make_el(qn(A_NS, "graphic"))
    gdata = make_el(qn(A_NS, "graphicData"), {"uri": "http://schemas.openxmlformats.org/drawingml/2006/picture"})
    pic = make_el(qn(PIC_NS, "pic"))
    nv = make_el(qn(PIC_NS, "nvPicPr"))
    nv.append(make_el(qn(PIC_NS, "cNvPr"), {"id": pic_id, "name": name}))
    nv.append(make_el(qn(PIC_NS, "cNvPicPr")))
    pic.append(nv)
    blipFill = make_el(qn(PIC_NS, "blipFill"))
    blip = make_el(qn(A_NS, "blip"), {qn(R_NS, "embed"): rel_id})
    blipFill.append(blip)
    stretch = make_el(qn(A_NS, "stretch"))
    stretch.append(make_el(qn(A_NS, "fillRect")))
    blipFill.append(stretch)
    pic.append(blipFill)
    spPr = make_el(qn(PIC_NS, "spPr"))
    xfrm = make_el(qn(A_NS, "xfrm"))
    xfrm.append(make_el(qn(A_NS, "off"), {"x": "0", "y": "0"}))
    xfrm.append(make_el(qn(A_NS, "ext"), {"cx": inches_to_emu(width_in), "cy": inches_to_emu(height_in)}))
    spPr.append(xfrm)
    geom = make_el(qn(A_NS, "prstGeom"), {"prst": "rect"})
    geom.append(make_el(qn(A_NS, "avLst")))
    spPr.append(geom)
    pic.append(spPr)
    gdata.append(pic)
    c_nv.append(gdata)
    inline.append(c_nv)
    drawing.append(inline)
    run.append(drawing)
    p.append(run)
    return p


def create_section_props(footer: bool, *, next_page: bool = False) -> ET.Element:
    sect = make_el(qn(W_NS, "sectPr"))
    if next_page:
        sect.append(make_el(qn(W_NS, "type"), {qn(W_NS, "val"): "nextPage"}))
    pg_sz = make_el(qn(W_NS, "pgSz"), {qn(W_NS, "w"): str(A4_WIDTH), qn(W_NS, "h"): str(A4_HEIGHT)})
    pg_mar = make_el(qn(W_NS, "pgMar"), {
        qn(W_NS, "top"): str(MARGIN),
        qn(W_NS, "right"): str(MARGIN),
        qn(W_NS, "bottom"): str(MARGIN),
        qn(W_NS, "left"): str(MARGIN),
        qn(W_NS, "header"): "720",
        qn(W_NS, "footer"): "720",
        qn(W_NS, "gutter"): "0",
    })
    cols = make_el(qn(W_NS, "cols"), {qn(W_NS, "space"): "720"})
    docgrid = make_el(qn(W_NS, "docGrid"), {qn(W_NS, "linePitch"): "360"})
    sect.append(pg_sz)
    sect.append(pg_mar)
    sect.append(cols)
    sect.append(docgrid)
    if footer:
        sect.append(make_el(qn(W_NS, "footerReference"), {qn(W_NS, "type"): "default", qn(R_NS, "id"): "rIdFooter1"}))
        sect.append(make_el(qn(W_NS, "pgNumType"), {qn(W_NS, "start"): str(PAGE_START)}))
    return sect


def write_docx(output_path: Path) -> None:
    body_children, images = build_body()
    cover = [
        paragraph([style_run("JX-Team校园主题游戏商店系统设计与实现", font_east="SimHei", font_ascii="Times New Roman", size_pt=24, bold=True)], style="CoverTitle", align="center", before_pt=0, after_pt=18, line_pt=24, line_rule="auto", first_line_twips=0),
        blank_para(12),
        paragraph([style_run("组长：戴璟粼 202326202099", size_pt=16)], style="CoverInfo", align="center", before_pt=0, after_pt=6, line_pt=22, line_rule="auto", first_line_twips=0),
        paragraph([style_run("组员：陆苇 202326202095", size_pt=16)], style="CoverInfo", align="center", before_pt=0, after_pt=6, line_pt=22, line_rule="auto", first_line_twips=0),
        paragraph([style_run("李玉鹏 202326202100", size_pt=16)], style="CoverInfo", align="center", before_pt=0, after_pt=6, line_pt=22, line_rule="auto", first_line_twips=0),
        paragraph([style_run("陈锋 202126304031", size_pt=16)], style="CoverInfo", align="center", before_pt=0, after_pt=0, line_pt=22, line_rule="auto", first_line_twips=0),
    ]

    toc = [
        paragraph([style_run("目录", font_east="SimHei", font_ascii="Times New Roman", size_pt=22, bold=True)], style="TOCTitle", align="center", before_pt=24, after_pt=18, line_pt=22, line_rule="auto", first_line_twips=0),
        toc_field_para(),
    ]

    # Build final body with cover section break, TOC, chapters, and refs.
    all_children: list[ET.Element] = []
    all_children.extend(cover)
    # Add section break to cover paragraph.
    sect_cover = create_section_props(False, next_page=True)
    cover[-1].find(qn(W_NS, "pPr")).append(sect_cover)

    all_children.extend(toc)
    all_children.append(page_break_para())
    # chapter/body children already contain a page break before chapter 1 etc.
    all_children.extend(body_children)

    # Final section properties with footer and page numbering.
    sect_final = create_section_props(True)
    doc_xml = create_document_xml(all_children, sect_final)
    styles_xml = create_styles_xml()
    settings_xml = create_settings_xml()
    footer_xml = create_footer_xml()
    root_rels = create_root_rels()
    doc_rels_xml = create_rels_xml(True, len(images))
    content_types = create_content_types(len(images))

    with zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types)
        zf.writestr("_rels/.rels", root_rels)
        zf.writestr("word/document.xml", doc_xml)
        zf.writestr("word/styles.xml", styles_xml)
        zf.writestr("word/settings.xml", settings_xml)
        zf.writestr("word/footer1.xml", footer_xml)
        zf.writestr("word/_rels/document.xml.rels", doc_rels_xml)
        for idx, (name, svg_bytes, _, _) in enumerate(images, start=1):
            zf.writestr(f"word/media/{name}", svg_bytes)


def main() -> None:
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    write_docx(OUT_PATH)
    print(f"[OK] wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
