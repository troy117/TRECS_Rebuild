package photo.software.admin;

import java.awt.Graphics2D;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Collections;

import javax.imageio.ImageIO;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import photo.software.comparators.StudentClassSortComparator;
import photo.software.comparators.StudentLastNameSortComparator;
import photo.software.composites.Homeroom;
import photo.software.student.Student;
import photo.software.student.Students;
import net.miginfocom.swing.MigLayout;

@SuppressWarnings("serial")
public class ImageExportGUI extends JInternalFrame implements ActionListener {

	private JCheckBox chckbxNewCheckBox, chckbxNewCheckBox_1, chckbxNewCheckBox_2, chckbxNewCheckBox_3,
			chckbxNewCheckBox_4;
	private String schoolPath;
	private JComboBox<String> comboBox, comboBox_1;
	private JButton btnExportImagesBy;
	private ArrayList<Student> input;
	private JCheckBox chckbxOnlyPackages;
	private JButton btnExportImagesBy_1;
	private JButton btnExportVerifiedBy;
	private JButton btnxsWithName;
	private JButton btnSlipSheetCount;
	JButton btnCreatecds;
	private Students students;
	private ArrayList<String> grades, listNames;
	CreateCD cdMaker;
	private JButton btnxName;
	private JButton btnGroupcdLabel;
	private JButton btnxName_1;
	private JButton btnYearbookCsvFile;
	private ArrayList<Homeroom> homerooms;
	private Row row;
	private JButton btnCertificateExcelFile_1;
	private JCheckBox chckbxYearbookLarge;
	private JButton btnProofExport;

	public ImageExportGUI(Students students, String schoolPath, String schoolName) {
		this.students = students;
		this.input = students.getStudents();
		this.schoolPath = schoolPath;
		cdMaker = new CreateCD(students.getStudents(), schoolPath, schoolName);

		setBounds(100, 100, 583, 360);
		grades = new ArrayList<String>();
		for (Student s : input)
			if (!grades.contains(s.grade))
				grades.add(s.grade);
		Collections.sort(grades);
		listNames = new ArrayList<String>();
		listNames = students.getListNames();

		getContentPane().setLayout(new MigLayout("", "[][][][grow]", "[][][][][][][][][][][][]"));

		JLabel lblChooseCdTypes = new JLabel("Choose CD Types");
		getContentPane().add(lblChooseCdTypes, "cell 1 0");

		chckbxNewCheckBox = new JCheckBox("SASI");
		getContentPane().add(chckbxNewCheckBox, "cell 1 1");

		comboBox = new JComboBox<String>();
		comboBox.addItem("All Students");
		comboBox.addItem("Grade");
		comboBox.addItem("List");
		comboBox.addActionListener(this);
		getContentPane().add(comboBox, "cell 3 1,growx");

		chckbxNewCheckBox_1 = new JCheckBox("Destiny");
		getContentPane().add(chckbxNewCheckBox_1, "cell 1 2");

		comboBox_1 = new JComboBox<String>();
		comboBox_1.setVisible(false);
		getContentPane().add(comboBox_1, "cell 3 2,growx");

		chckbxNewCheckBox_2 = new JCheckBox("StudentCD");
		getContentPane().add(chckbxNewCheckBox_2, "cell 1 3");

		chckbxOnlyPackages = new JCheckBox("Only Packages");
		getContentPane().add(chckbxOnlyPackages, "cell 3 3");

		chckbxNewCheckBox_3 = new JCheckBox("Powerschool");
		getContentPane().add(chckbxNewCheckBox_3, "cell 1 4");

		btnExportImagesBy = new JButton("Export Images by LastName");
		btnExportImagesBy.addActionListener(this);
		getContentPane().add(btnExportImagesBy, "cell 3 4");

		chckbxNewCheckBox_4 = new JCheckBox("Yearbook Small");
		getContentPane().add(chckbxNewCheckBox_4, "cell 1 5");

		btnExportImagesBy_1 = new JButton("Export Images by RefNum");
		btnExportImagesBy_1.addActionListener(this);
		getContentPane().add(btnExportImagesBy_1, "cell 3 5");

		btnExportVerifiedBy = new JButton("Export Verified by Homeroom");
		btnExportVerifiedBy.addActionListener(this);

		chckbxYearbookLarge = new JCheckBox("Yearbook Large");
		getContentPane().add(chckbxYearbookLarge, "cell 1 6");
		getContentPane().add(btnExportVerifiedBy, "cell 3 6");

		btnxsWithName = new JButton("5x7's with Name");
		btnxsWithName.addActionListener(this);

		btnCreatecds = new JButton("CreateCDs");
		btnCreatecds.addActionListener(this);
		getContentPane().add(btnCreatecds, "cell 1 7");
		getContentPane().add(btnxsWithName, "flowx,cell 3 7");

		btnxName = new JButton("5.5x7.5 Name & Title");
		getContentPane().add(btnxName, "cell 3 7");

		btnSlipSheetCount = new JButton("Slip Sheet Count");
		btnSlipSheetCount.addActionListener(this);

		btnGroupcdLabel = new JButton("GroupCD label");
		btnGroupcdLabel.addActionListener(this);
		getContentPane().add(btnGroupcdLabel, "cell 1 8");
		getContentPane().add(btnSlipSheetCount, "flowx,cell 3 8");

		btnxName_1 = new JButton("4x5 Name & Grade");
		btnxName_1.addActionListener(this);
		getContentPane().add(btnxName_1, "cell 3 8");

		btnYearbookCsvFile = new JButton("Yearbook CSV File");
		btnYearbookCsvFile.addActionListener(this);
		getContentPane().add(btnYearbookCsvFile, "flowx,cell 3 10");

		btnCertificateExcelFile_1 = new JButton("Certificate Excel File with Grade");
		btnCertificateExcelFile_1.addActionListener(this);
		getContentPane().add(btnCertificateExcelFile_1, "cell 3 11");

		btnProofExport = new JButton("Export Images for Website");
		btnProofExport.addActionListener(this);
		getContentPane().add(btnProofExport, "cell 3 11");

		btnxName.addActionListener(this);
		this.setVisible(true);
		this.setClosable(true);

	}

	public void updateComboBox() {
		if (comboBox.getSelectedIndex() == 0)
			comboBox_1.setVisible(false);
		if (comboBox.getSelectedIndex() == 1) {
			comboBox_1.removeAllItems();
			comboBox_1.setVisible(true);
			for (String g : grades)
				comboBox_1.addItem(g);
		}
		if (comboBox.getSelectedIndex() == 2) {
			comboBox_1.removeAllItems();
			comboBox_1.setVisible(true);

			for (String l : listNames)
				comboBox_1.addItem(l);
		}
	}

	public void fiveXseven() {
		ArrayList<Student> exportL = new ArrayList<Student>();
		if (comboBox.getSelectedIndex() == 0)
			for (Student s : input)
				exportL.add(s);
		if (comboBox.getSelectedIndex() == 1)
			for (Student s : input)
				if (s.grade.equals(comboBox_1.getSelectedItem()))
					exportL.add(s);
		if (comboBox.getSelectedIndex() == 2)
			exportL.addAll(students.getStudentsFromList((String) comboBox_1.getSelectedItem()));
		new File(schoolPath + "\\Exports\\5x7").mkdirs();
		Collections.sort(exportL, new StudentLastNameSortComparator());
		new FiveXSevenExport(exportL, schoolPath + "\\CroppedLarge", schoolPath + "\\Exports\\5x7");
	}

	public void fiveXsevenTitle() {
		ArrayList<Student> exportL = new ArrayList<Student>();
		if (comboBox.getSelectedIndex() == 0)
			for (Student s : input)
				exportL.add(s);
		if (comboBox.getSelectedIndex() == 1)
			for (Student s : input)
				if (s.grade.equals(comboBox_1.getSelectedItem()))
					exportL.add(s);
		if (comboBox.getSelectedIndex() == 2)
			exportL.addAll(students.getStudentsFromList((String) comboBox_1.getSelectedItem()));
		new File(schoolPath + "\\Exports\\5x7Name").mkdirs();
		Collections.sort(exportL, new StudentLastNameSortComparator());
		new FiveXSevenNameTitle(exportL, schoolPath + "\\CroppedLarge", schoolPath + "\\Exports\\5x7Name");
	}

	public void homeExport() {
		ArrayList<Student> exportL = new ArrayList<Student>();
		if (comboBox.getSelectedIndex() == 0)
			for (Student s : input)
				exportL.add(s);
		if (comboBox.getSelectedIndex() == 1)
			for (Student s : input)
				if (s.grade.equals(comboBox_1.getSelectedItem()))
					exportL.add(s);
		if (comboBox.getSelectedIndex() == 2)
			exportL.addAll(students.getStudentsFromList((String) comboBox_1.getSelectedItem()));
		new File(schoolPath + "\\Exports\\HomeExport").mkdirs();
		int i = 0;
		Collections.sort(exportL, new StudentLastNameSortComparator());
		for (Student s : exportL) {
			if (s.photo.equals("true")) {
				try {
					Files.copy(new File(schoolPath + "\\CroppedMed\\" + s.ref + ".jpg").toPath(),
							new File(schoolPath + "\\Exports\\HomeExport\\" + s.homeroom + "_" + s.last + "_" + s.first
									+ "_" + i + ".jpg").toPath());
				} catch (IOException e) {
					// TODO Auto-generated catch block
					JOptionPane.showMessageDialog(null, "Error Exporting " + s.ref + " " + s.last + " " + s.first);
				}
				i++;
			}

		}
	}

	public void websiteExport() {
		try {
			BufferedImage proof = ImageIO.read(new File("Templates\\FALL\\PROOF.png"));
			new File(schoolPath + "\\Exports\\Website\\").mkdirs();
			ArrayList<Student> data = students.getStudents();
			for (int i = 0; i < data.size(); i++) {
				Student student = data.get(i);
				if (!student.ID.equals("") && student.photo.equals("true")) {
					try {
						BufferedImage source = ImageIO
								.read(new File(schoolPath + "\\CroppedSmall\\" + student.ref + ".jpg"));
						Graphics2D g = source.createGraphics();
						g.drawImage(proof, 0, 0, null);
						g.dispose();
						ImageIO.write(source, "jpg",
								new File(schoolPath + "\\Exports\\Website\\" + student.last + student.ID + ".jpg"));
					} catch (Exception e1) {
						JOptionPane.showMessageDialog(null, "Error opening or saving images: " + e1);
					}
				}
			}
		} catch (Exception e) {
			JOptionPane.showMessageDialog(null, "Error in WebsiteExport: " + e);
		}
	}

	public void refExport() {
		try {
			ArrayList<Student> exportL = new ArrayList<Student>();
			if (comboBox.getSelectedIndex() == 0)
				for (Student s : input)
					exportL.add(s);
			if (comboBox.getSelectedIndex() == 1)
				for (Student s : input)
					if (s.grade.equals(comboBox_1.getSelectedItem()))
						exportL.add(s);
			if (comboBox.getSelectedIndex() == 2)
				exportL.addAll(students.getStudentsFromList((String) comboBox_1.getSelectedItem()));
			new File(schoolPath + "\\Exports\\ExportRef").mkdirs();
			PrintWriter log = new PrintWriter(
					new BufferedWriter(new FileWriter(schoolPath + "\\Exports\\ExportRef\\Ref_FName_LName.txt", true)));
			log.println();
			boolean onlyPackages = chckbxOnlyPackages.isSelected();
			Collections.sort(exportL, new StudentLastNameSortComparator());
			for (Student s : exportL) {
				if (s.photo.equals("true")) {
					if (onlyPackages) {
						if (s.order1Pay.equals("true")) {
							try {
								Files.copy(new File(schoolPath + "\\CroppedLarge\\" + s.ref + ".jpg").toPath(),
										new File(schoolPath + "\\Exports\\ExportRef\\" + s.ref + ".jpg").toPath());
								log.println(s.ref + ".jpg\t" + s.first + "\t" + s.last);
							} catch (IOException e) {
								log.println("Error Exporting " + s.ref + " " + s.last + " " + s.first);
								JOptionPane.showMessageDialog(null,
										"Error Exporting " + s.ref + " " + s.last + " " + s.first);
							}
						}
					} else {
						try {
							Files.copy(new File(schoolPath + "\\CroppedLarge\\" + s.ref + ".jpg").toPath(),
									new File(schoolPath + "\\Exports\\ExportRef\\" + s.ref + ".jpg").toPath());
							log.println(s.ref + ".jpg\t" + s.first + "\t" + s.last);
						} catch (IOException e) {
							log.println("Error Exporting " + s.ref + " " + s.last + " " + s.first);
							JOptionPane.showMessageDialog(null,
									"Error Exporting " + s.ref + " " + s.last + " " + s.first);
						}
					}

				}

			}
			log.close();
		} catch (Exception e) {
		}
	}

	public void fourXfive() {
		ArrayList<Student> exportL = new ArrayList<Student>();
		if (comboBox.getSelectedIndex() == 0)
			for (Student s : input)
				exportL.add(s);
		if (comboBox.getSelectedIndex() == 1)
			for (Student s : input)
				if (s.grade.equals(comboBox_1.getSelectedItem()))
					exportL.add(s);
		if (comboBox.getSelectedIndex() == 2)
			exportL.addAll(students.getStudentsFromList((String) comboBox_1.getSelectedItem()));
		new File(schoolPath + "\\Exports\\4x5s").mkdirs();
		Collections.sort(exportL, new StudentClassSortComparator());
		new FourXFiveExport(exportL, schoolPath + "\\CroppedLarge", schoolPath + "\\Exports\\4x5s");
	}

	public void slipSheet() {
		JOptionPane.showMessageDialog(null, "Does not work yet, need to finish Composite & Homeroom class!");
		/*
		 * Need to fix and do stuff with homerooms homerooms = new
		 * ArrayList<Homeroom>(); Collections.sort(input, new
		 * StudentClassSortComparator()); for(Student s:input) {
		 * if((!s.getTeacher().equals("")) &&(!s.getLast().equals(""))
		 * &&(!s.getFirst().equals("")) &&(!s.getGrade().equals("EXMPT")))
		 * addToHomeroom(s); } try{ PrintWriter out = new
		 * PrintWriter(dir+"\\CDs\\SlipSheet.txt"); for(Homeroom h:homerooms)
		 * out.println(h.getHomeroom()+"\t"+h.totalStudents()); out.close();
		 * }catch(Exception
		 * e){JOptionPane.showMessageDialog(null,"Error adding line to SlipSheet: "+e);}
		 */
	}

	private void yearbookCSV() {
		ArrayList<Student> allStudents = new ArrayList<Student>();
		ArrayList<Student> staff = new ArrayList<Student>();
		allStudents = students.getStudents();
		Collections.sort(allStudents, new StudentClassSortComparator());
		homerooms = new ArrayList<Homeroom>();
		for (Student s : allStudents) {
			if ((!s.homeroom.equals("")) && (!s.last.equals("")) && (!s.first.equals("")) && (!s.grade.equals("EXMPT"))
					&& (s.photo.toUpperCase().equals("TRUE")))
				addToHomeroom(s);
			if (s.grade.equals("FAC") && s.photo.toUpperCase().equals("TRUE"))
				staff.add(s);
		}
		ArrayList<Student> tempTeach, tempStudents;
		new File(schoolPath + "\\Exports\\YearbookCSV").mkdir();
		String absolutePath = new File(schoolPath + "\\CroppedLarge").getAbsolutePath();
		String csvName = "";
		for (Homeroom h : homerooms) {
			tempTeach = new ArrayList<Student>();
			tempTeach = h.getTeachers();
			Collections.sort(tempTeach, new StudentLastNameSortComparator());
			tempStudents = new ArrayList<Student>();
			tempStudents = h.getStudents();
			Collections.sort(tempStudents, new StudentLastNameSortComparator());
			csvName = "";
			if (tempTeach.size() > 0)
				csvName = (h.totalSize() + 1) + "_" + h.getHomeroom() + "_" + h.getCSVGrades() + ".csv";
			else
				csvName = (h.totalSize()) + "_" + h.getHomeroom() + "_" + h.getCSVGrades() + ".csv";
			try {
				FileWriter writer = new FileWriter(new File(schoolPath + "\\Exports\\YearbookCSV\\" + csvName));
				writer.write("Last,First,Grade,Homeroom,@Photos\n");
				if (tempTeach.size() > 0) {
					for (Student t : tempTeach)
						writer.write(t.last + "," + t.first + "," + t.grade + "," + t.homeroom + "," + absolutePath
								+ "\\" + t.ref + ".JPG" + "\n");
					writer.write(",,,,\n");
				}
				for (Student t : tempStudents)
					writer.write(t.last + "," + t.first + "," + t.grade + "," + t.homeroom + "," + absolutePath + "\\"
							+ t.ref + ".JPG" + "\n");
				writer.write("\n");
				writer.close();
			} catch (IOException e) {
				JOptionPane.showMessageDialog(null, "Error: " + e);
			}
		}
		Collections.sort(staff, new StudentLastNameSortComparator());
		try {
			csvName = staff.size() + "_Staff.csv";
			FileWriter writer = new FileWriter(new File(schoolPath + "\\Exports\\YearbookCSV\\" + csvName));
			writer.write("Last,First,Grade,Homeroom,@Photos\n");
			for (Student t : staff)
				writer.write(t.last + "," + t.first + "," + t.grade + "," + t.homeroom + "," + absolutePath + "\\"
						+ t.ref + ".JPG" + "\n");
			writer.write("\n");
			writer.close();
		} catch (IOException e) {
			JOptionPane.showMessageDialog(null, "Error: " + e);
		}
	}

	private void certificateExport() {
		try {
			XSSFWorkbook wb = new XSSFWorkbook();
			Sheet sheet;

			int i;
			ArrayList<Student> allStudents = new ArrayList<Student>();
			allStudents = students.getStudents();
			Collections.sort(allStudents, new StudentClassSortComparator());
			homerooms = new ArrayList<Homeroom>();
			for (Student s : allStudents) {
				if ((!s.homeroom.equals("")) && (!s.last.equals("")) && (!s.first.equals(""))
						&& (!s.grade.equals("EXMPT")))
					addToHomeroom(s);
			}
			ArrayList<Student> tempTeach, tempStudents;
			sheet = wb.createSheet("Certificates");
			i = 0;
			row = sheet.createRow(i);
			row.createCell(0).setCellValue("ID");
			row.createCell(1).setCellValue("First");
			row.createCell(2).setCellValue("Last");
			row.createCell(3).setCellValue("Reference");
			row.createCell(4).setCellValue("Photographed");
			row.createCell(5).setCellValue("Teacher");
			row.createCell(6).setCellValue("Grade");
			row.createCell(7).setCellValue("Homeroom");
			i++;
			for (Homeroom h : homerooms) {
				tempTeach = new ArrayList<Student>();
				tempTeach = h.getTeachers();
				Collections.sort(tempTeach, new StudentLastNameSortComparator());
				tempStudents = new ArrayList<Student>();
				tempStudents = h.getStudents();
				Collections.sort(tempStudents, new StudentLastNameSortComparator());
				for (Student t : tempStudents) {
					i++;
					row = sheet.createRow(i);
					if (h.getTeacherCertificate().equals(""))
						addToExcelList(t, t.homeroom, h.getHomeroom());
					else
						addToExcelList(t, h.getTeacherCertificate(), h.getHomeroom());
				}
			}
			FileOutputStream fileOut = new FileOutputStream(schoolPath + "\\Exports\\CertificateSpreadsheet.xlsx");
			wb.write(fileOut);
			wb.close();
			fileOut.close();
			JOptionPane.showMessageDialog(null, "Complete");
		} catch (Exception e) {
			JOptionPane.showMessageDialog(null, "Error Generating Certificate Spreadsheet: " + e);
		}
	}

	private void addToExcelList(Student s, String teacher, String homeroom) {
		row.createCell(0).setCellValue(s.ID);
		row.createCell(1).setCellValue(s.first);
		row.createCell(2).setCellValue(s.last);
		row.createCell(3).setCellValue(s.ref);
		row.createCell(4).setCellValue(s.photo);
		row.createCell(5).setCellValue(teacher);
		row.createCell(6).setCellValue(s.grade);
		row.createCell(7).setCellValue(homeroom);
	}

	private void addToHomeroom(Student s) {
		Boolean exists = false;
		for (Homeroom h : homerooms) {
			if (h.getHomeroom().equals(s.homeroom)) {
				exists = true;
				h.addStudent(s);
				return;
			}
		}
		if (!exists) {
			homerooms.add(new Homeroom(s.homeroom));
			for (Homeroom h : homerooms) {
				if (h.getHomeroom().equals(s.homeroom))
					h.addStudent(s);
			}
		}
	}

	public void export() {
		ArrayList<Student> exportL = new ArrayList<Student>();
		if (comboBox.getSelectedIndex() == 0)
			for (Student s : input)
				exportL.add(s);
		else if (comboBox.getSelectedIndex() == 1)
			for (Student s : input)
				if (s.grade.equals(comboBox_1.getSelectedItem()))
					exportL.add(s);
				else if (comboBox.getSelectedIndex() == 2)
					exportL.addAll(students.getStudentsFromList((String) comboBox_1.getSelectedItem()));
		new File(schoolPath + "\\Exports\\Export").mkdirs();
		int i = 0;
		Collections.sort(exportL, new StudentLastNameSortComparator());
		for (Student s : exportL) {
			if (s.photo.equals("true")) {
				try {
					Files.copy(new File(schoolPath + "\\CroppedLarge\\" + s.ref + ".jpg").toPath(),
							new File(schoolPath + "\\Exports\\Export\\" + i + "_" + s.last + "_" + s.first + ".jpg")
									.toPath());
				} catch (IOException e) {
					// TODO Auto-generated catch block
					JOptionPane.showMessageDialog(null, "Error Exporting " + s.ref + " " + s.last + " " + s.first);
				}
				i++;
			}

		}
	}

	public void actionPerformed(ActionEvent arg0) {
		Object pressed = arg0.getSource();
		if (pressed == comboBox)
			updateComboBox();
		else if (pressed == btnExportImagesBy) {
			export();
		} else if (pressed == btnGroupcdLabel) {
			cdMaker.cdLabel("Group");
		} else if (pressed == btnCreatecds) {
			if (chckbxNewCheckBox.isSelected() || chckbxNewCheckBox_2.isSelected()
					|| chckbxNewCheckBox_4.isSelected()) {
				cdMaker.cdLabel("Admin");
			}
			if (chckbxNewCheckBox.isSelected())
				cdMaker.SASI();
			if (chckbxNewCheckBox_1.isSelected()) {
				cdMaker.cdLabel("Library");
				cdMaker.destiny();
			}
			if (chckbxNewCheckBox_2.isSelected())
				cdMaker.studentCD();
			if (chckbxNewCheckBox_3.isSelected())
				cdMaker.powerschool();
			if (chckbxNewCheckBox_4.isSelected()) {
				cdMaker.cdLabel("Yearbook");
				cdMaker.yearbookCD(false);
				cdMaker.ybCD(false);
			}
			if (chckbxYearbookLarge.isSelected()) {
				cdMaker.cdLabel("Yearbook");
				cdMaker.yearbookCD(true);
				cdMaker.ybCD(true);
			}
		} else if (pressed == btnExportImagesBy_1) {
			refExport();
		} else if (pressed == btnExportVerifiedBy) {
			homeExport();
		} else if (pressed == btnxsWithName) {
			fiveXseven();
		} else if (pressed == btnxName) {
			fiveXsevenTitle();
		} else if (pressed == btnSlipSheetCount) {
			slipSheet();
		} else if (pressed == btnxName_1) {
			fourXfive();
		} else if (pressed == btnYearbookCsvFile) {
			yearbookCSV();
		} else if (pressed == btnCertificateExcelFile_1) {
			certificateExport();
		} else if (pressed == btnProofExport) {
			websiteExport();
		}

	}

}

/*
 * 
 * 
 * Old Function
 * 
 * 
 * private void certificateExport(boolean withGrade) { try { XSSFWorkbook wb =
 * new XSSFWorkbook(); Sheet sheet;
 * 
 * int i; ArrayList<Student> allStudents = new ArrayList<Student>(); allStudents
 * = students.getStudents(); Collections.sort(allStudents, new
 * StudentClassSortComparator()); homerooms = new ArrayList<Homeroom>();
 * for(Student s:allStudents) { if((!s.homeroom.equals(""))
 * &&(!s.last.equals("")) &&(!s.first.equals("")) &&(!s.grade.equals("EXMPT")))
 * addToHomeroom(s); } ArrayList<Student> tempTeach, tempStudents; for(Homeroom
 * h:homerooms) { sheet = wb.createSheet(h.getHomeroom()); i=0; row =
 * sheet.createRow(i); row.createCell(0).setCellValue("ID");
 * row.createCell(1).setCellValue("First");
 * row.createCell(2).setCellValue("Last");
 * row.createCell(3).setCellValue("Teacher"); if(withGrade)
 * row.createCell(4).setCellValue("Grade"); tempTeach = new
 * ArrayList<Student>(); tempTeach = h.getTeachers();
 * Collections.sort(tempTeach, new StudentLastNameSortComparator());
 * tempStudents = new ArrayList<Student>(); tempStudents = h.getStudents();
 * Collections.sort(tempStudents, new StudentLastNameSortComparator());
 * for(Student t:tempStudents) { i++; row = sheet.createRow(i);
 * addToExcelList(t,h.getTeacherCertificate(), withGrade); } } FileOutputStream
 * fileOut = new
 * FileOutputStream(schoolPath+"\\Exports\\CertificateSpreadsheet.xlsx");
 * wb.write(fileOut); wb.close(); fileOut.close();
 * JOptionPane.showMessageDialog(null, "Complete"); } catch(Exception
 * e){JOptionPane.showMessageDialog(null,
 * "Error Generating Certificate Spreadsheet: "+e);} }
 * 
 * 
 * 
 * 
 */