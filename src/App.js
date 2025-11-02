// App.js
import "./styles.css";
import React from "react";
import {
  PDFDownloadLink,
  PDFViewer,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Svg,
  Path,
} from "@react-pdf/renderer";

/* Page + working area (US Letter, landscape) */
const PAGE = { padding: 20, w: 792, h: 612 };
const WORK_W = PAGE.w - PAGE.padding * 2;

/* Header has 3 fixed columns so the title stays centered */
const HEADER = { H: 100, LEFT: 220, RIGHT: 120, MID: WORK_W - 220 - 120 };

/* Body copy and row sizes */
const FONT_BASE = 14; // table/body text
const ROW_H = 32;

/* Table column widths */
const LEFT_GRID_W = 560;
const REMARKS_W = WORK_W - LEFT_GRID_W;
const COL_W = LEFT_GRID_W / 2;

/* Fixed label widths to align all values vertically */
const LABEL_W_LEFT = 120;
const LABEL_W_RIGHT = 130;

/* Small spacing helpers */
const VALUE_GAP = 6;
const CELL_PAD_X = 8;
const CELL_PAD_TOP = 6;

/* Colors */
const BLACK = "#000";
const DM_GREY = "#8F8F8F";
const SUBTITLE_NEAR_BLACK = "#222"; // slightly lighter than black

const styles = StyleSheet.create({
  page: { padding: PAGE.padding, fontSize: FONT_BASE },

  // Header frame
  header: { flexDirection: "row", height: HEADER.H, border: "1pt solid #000" },
  hLeft: {
    width: HEADER.LEFT,
    borderRight: "1pt solid #000",
    justifyContent: "center",
    alignItems: "center",
  },
  hMid: {
    width: HEADER.MID,
    borderRight: "1pt solid #000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  hRight: {
    width: HEADER.RIGHT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  // Header content
  logoRow: {
    width: HEADER.LEFT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoWordBORE: { fontSize: 26, fontWeight: 700, color: BLACK },
  logoWordDM: { fontSize: 26, fontWeight: 700, color: DM_GREY, marginLeft: 2 },

  title: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 700,
    textAlign: "center",
    color: SUBTITLE_NEAR_BLACK,
  },
  b17: { fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 10 },
  pageOne: { fontSize: 11, textAlign: "center" },

  // Grid shell
  tableRow: {
    flexDirection: "row",
    borderLeft: "1pt solid #000",
    borderRight: "1pt solid #000",
  },
  leftGrid: { width: LEFT_GRID_W, borderRight: "1pt solid #000" },
  gridRow: { flexDirection: "row" },

  // Cell box
  cell: {
    width: COL_W,
    height: ROW_H,
    borderBottom: "1pt solid #000",
    borderRight: "1pt solid #000",
    paddingHorizontal: CELL_PAD_X,
    paddingTop: CELL_PAD_TOP,
  },
  lastInRow: { borderRight: 0 },

  // Label/value layout inside a cell
  lineRow: { flexDirection: "row", alignItems: "flex-start" },
  labelBox: {
    width: LABEL_W_LEFT,
    flexDirection: "row",
    alignItems: "center",
  },
  valueBox: { flexGrow: 1, marginLeft: VALUE_GAP, alignItems: "flex-start" },
  text: { textAlign: "left" },

  // Remarks column: header + dash on first line, then empty fill area
  remarks: { width: REMARKS_W },
  remarksTop: {
    paddingHorizontal: CELL_PAD_X,
    paddingTop: 2,
    height: ROW_H + 8,
    justifyContent: "flex-start",
  },
  remarksFill: {
    height: ROW_H * 3 - 8,
    borderBottom: 0,
  },

  // Bottom strip closes the whole table
  finalRow: {
    flexDirection: "row",
    borderLeft: "1pt solid #000",
    borderRight: "1pt solid #000",
    borderTop: "1pt solid #000",
    borderBottom: "1pt solid #000",
  },
  finalLeftCell: {
    width: COL_W,
    height: ROW_H,
    borderRight: "1pt solid #000",
    paddingHorizontal: CELL_PAD_X,
    paddingTop: CELL_PAD_TOP,
  },
  finalRightCell: {
    width: COL_W + REMARKS_W,
    height: ROW_H,
    paddingHorizontal: CELL_PAD_X,
    paddingTop: CELL_PAD_TOP,
  },
});

/* BOREDM drill icon: pointy tip + three white back-slanted stripes */
const DrillIcon = () => (
  <Svg width="60" height="48" viewBox="0 0 60 48" style={{ marginRight: 10 }}>
    <Path d="M28 4 L36 4 L36 36 L32 44 L28 36 Z" fill="#000000" />
    <Path d="M28 12 L36 13 L36 15 L28 14 Z" fill="#FFFFFF" />
    <Path d="M28 22 L36 23 L36 25 L28 24 Z" fill="#FFFFFF" />
    <Path d="M28 32 L36 33 L36 35 L28 34 Z" fill="#FFFFFF" />
  </Svg>
);

/* Water symbol: split triangle + two baseline strokes */
const WaterIcon = () => (
  <Svg
    width="16"
    height="14"
    viewBox="0 0 16 14"
    style={{ marginRight: 10, marginTop: -1 }}
  >
    <Path d="M1 2 L8 2 L8 10 Z" fill="#000000" />
    <Path d="M8 2 L15 2 L8 10 Z" fill="#FFFFFF" />
    <Path d="M1 2 L15 2 L8 10 Z" fill="none" stroke="#000000" strokeWidth="1" />
    <Path d="M1 12 L15 12" stroke="#000000" strokeWidth="1" />
    <Path d="M6 13 L10 13" stroke="#000000" strokeWidth="1" />
  </Svg>
);

/* Reusable table cell */
const LabeledCell = ({
  label,
  value,
  last = false,
  column = "left",
  icon = null,
  noBottom = false,
}) => {
  const labelWidth = column === "left" ? LABEL_W_LEFT : LABEL_W_RIGHT;
  return (
    <View
      style={[
        styles.cell,
        noBottom && { borderBottom: 0 },
        last && styles.lastInRow,
      ]}
    >
      <View style={styles.lineRow}>
        <View style={[styles.labelBox, { width: labelWidth }]}>
          {icon}
          <Text style={styles.text}>{label}</Text>
        </View>
        <View style={styles.valueBox}>
          {value ? <Text style={styles.text}>{value}</Text> : null}
        </View>
      </View>
    </View>
  );
};

/* The actual PDF document */
const MyDoc = () => (
  <Document>
    <Page size="LETTER" orientation="landscape" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.hLeft}>
          <View style={styles.logoRow}>
            <DrillIcon />
            <Text style={styles.logoWordBORE}>BORE</Text>
            <Text style={styles.logoWordDM}>DM</Text>
          </View>
        </View>

        <View style={styles.hMid}>
          <Text style={styles.title}>Riverside Condominiums</Text>
          <Text style={styles.subtitle}>General Location - Project</Text>
        </View>

        <View style={styles.hRight}>
          <Text style={styles.b17}>B-17</Text>
          <Text style={styles.pageOne}>Page 1 of 1</Text>
        </View>
      </View>

      {/* Table rows + remarks */}
      <View style={styles.tableRow}>
        <View style={styles.leftGrid}>
          <View style={styles.gridRow}>
            <LabeledCell
              label="Drilling Firm:"
              value="BoreDM Drilling"
              column="left"
            />
            <LabeledCell
              label="Project No.:"
              value="25-3332"
              column="right"
              last
            />
          </View>

          <View style={styles.gridRow}>
            <LabeledCell label="Driller:" value="PA" column="left" />
            <LabeledCell
              label="Date Drilled:"
              value="03/05/2025"
              column="right"
              last
            />
          </View>

          <View style={styles.gridRow}>
            <LabeledCell label="Logged By:" value="LA" column="left" />
            <LabeledCell label="Boring Depth:" value="-" column="right" last />
          </View>

          <View style={styles.gridRow}>
            <LabeledCell
              label="Water :"
              value="N/A"
              column="left"
              icon={<WaterIcon />}
              noBottom
            />
            <LabeledCell
              label="Boring Elevation:"
              value="N/A"
              column="right"
              last
              noBottom
            />
          </View>
        </View>

        <View style={styles.remarks}>
          <View style={styles.remarksTop}>
            <Text style={styles.text}>Remarks:</Text>
            <Text style={styles.text}>-</Text>
          </View>
          <View style={styles.remarksFill} />
        </View>
      </View>

      {/* Bottom strip */}
      <View style={styles.finalRow}>
        <View style={styles.finalLeftCell}>
          <View style={styles.lineRow}>
            <Text style={styles.text}>Hammer Type:</Text>
            <View style={{ width: VALUE_GAP }} />
            <Text style={styles.text}>-</Text>
          </View>
        </View>
        <View style={styles.finalRightCell}>
          <View style={styles.lineRow}>
            <View style={{ width: LABEL_W_RIGHT, alignItems: "flex-start" }}>
              <Text style={styles.text}>Brand Address:</Text>
            </View>
            <View style={{ marginLeft: VALUE_GAP, alignItems: "flex-start" }}>
              <Text style={styles.text}>
                4909 N. 44th St, Phoenix, AZ 85018
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

/* Mount: live preview + download link */
export default function App() {
  return (
    <div className="app">
      <div className="pdf-frame">
        <PDFViewer style={{ width: "100%", height: "75vh" }}>
          <MyDoc />
        </PDFViewer>
      </div>

      <PDFDownloadLink document={<MyDoc />} fileName="BoreDM-B17.pdf">
        {({ loading }) => (loading ? "Preparing your PDF…" : "Download PDF")}
      </PDFDownloadLink>
    </div>
  );
}
