package photo.software.admin;

import java.awt.Color;
import java.awt.FontMetrics;
import java.awt.Graphics2D;

import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JOptionPane;

import photo.software.admin.id.IDCardGUI;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.login.SchoolData;
import photo.software.student.Student;
import photo.software.student.Students;

import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;

@SuppressWarnings("serial")
public class AdminItems1GUI extends JInternalFrame implements ActionListener{

	private JCheckBox chckbxSasi, chckbxStudentCd, chckbxDestiny, chckbxStaffLarge, chckbxPowerschool, chckbxStaffMed;
	private JButton btnCreateCds, btnCreateIds, btnSchoolDirectory, btnDeliveryEnvelope;
	private SchoolData schoolData;
	private String schoolPath, outputPath;
	private JLabel lblOutputFolder;
	private JButton btnOutputFolder;
	private Students students;
	private DesktopWindow window;
	private JobData job;
	private JLabel lblGenerateMissingReport;
	private JButton btnMissingReport;
	
	
	public AdminItems1GUI(DesktopWindow window, Students students, SchoolData schoolData, String schoolPath, JobData job) 
	{
		this.students = students;
		this.schoolData = schoolData;
		this.schoolPath = schoolPath;
		this.window = window;
		this.job = job;
				
		setBounds(100, 100, 420, 380);
		getContentPane().setLayout(new MigLayout("", "[grow][][]", "[][][][][][][][][][][]"));
		
		JLabel lblAdministrativeItemsBefore = new JLabel("Administrative Items Before Makeup Day");
		lblAdministrativeItemsBefore.setFont(new Font("Tahoma", Font.PLAIN, 20));
		getContentPane().add(lblAdministrativeItemsBefore, "cell 0 0 3 1,alignx center");
		
		lblOutputFolder = new JLabel("Output Folder:");
		getContentPane().add(lblOutputFolder, "cell 0 2");
		
		btnOutputFolder = new JButton("Output Folder");
		btnOutputFolder.addActionListener(this);
		getContentPane().add(btnOutputFolder, "cell 1 2,growx");
		
		JLabel lblCreateDeliveryEnvelope = new JLabel("Create Delivery Envelope:");
		getContentPane().add(lblCreateDeliveryEnvelope, "cell 0 3");
		
		btnDeliveryEnvelope = new JButton("Delivery Envelope");
		btnDeliveryEnvelope.addActionListener(this);
		getContentPane().add(btnDeliveryEnvelope, "cell 1 3,growx");
		
		JLabel lblCreateSchoolDirectory = new JLabel("Create School Directory:");
		getContentPane().add(lblCreateSchoolDirectory, "cell 0 4");
		
		btnSchoolDirectory = new JButton("School Directory");
		btnSchoolDirectory.addActionListener(this);
		getContentPane().add(btnSchoolDirectory, "cell 1 4,growx");
		
		lblGenerateMissingReport = new JLabel("Generate Missing Report:");
		getContentPane().add(lblGenerateMissingReport, "cell 0 5");
		
		btnMissingReport = new JButton("Missing Report");
		btnMissingReport.addActionListener(this);
		getContentPane().add(btnMissingReport, "cell 1 5,growx");
		
		JLabel lblCreateStudent = new JLabel("Create Student & Staff IDs:");
		getContentPane().add(lblCreateStudent, "cell 0 6");
		
		btnCreateIds = new JButton("Create IDs");
		btnCreateIds.addActionListener(this);
		getContentPane().add(btnCreateIds, "cell 1 6,growx");
		
		JLabel lblAdministrativeCds = new JLabel("Administrative CDs:");
		getContentPane().add(lblAdministrativeCds, "cell 0 7");
		
		chckbxSasi = new JCheckBox("SASI");
		getContentPane().add(chckbxSasi, "cell 1 7");
		
		chckbxStudentCd = new JCheckBox("Student CD");
		getContentPane().add(chckbxStudentCd, "cell 2 7");
		
		chckbxDestiny = new JCheckBox("Destiny");
		getContentPane().add(chckbxDestiny, "cell 1 8");
		
		chckbxStaffLarge = new JCheckBox("Staff Large");
		getContentPane().add(chckbxStaffLarge, "cell 2 8");
		
		chckbxPowerschool = new JCheckBox("Powerschool");
		getContentPane().add(chckbxPowerschool, "cell 1 9");
		
		chckbxStaffMed = new JCheckBox("Staff Med");
		getContentPane().add(chckbxStaffMed, "cell 2 9");
		
		btnCreateCds = new JButton("Create CDs");
		btnCreateCds.addActionListener(this);
		getContentPane().add(btnCreateCds, "cell 1 10 2 1,growx");
		
		this.setClosable(true);
		this.setVisible(true);

	}

	@Override
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		if(pressed==btnOutputFolder)
		{
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int val = fc.showOpenDialog(null);
			if(val==JFileChooser.APPROVE_OPTION)
			{
				outputPath = fc.getSelectedFile().getAbsolutePath();
			}
		}
		if(pressed==btnCreateCds)
		{
			 CreateCD cds = new CreateCD(students.getStudents(), schoolPath, schoolData.schoolName);
			 if(chckbxStudentCd.isSelected()||chckbxPowerschool.isSelected()||chckbxSasi.isSelected()
					 ||chckbxStaffLarge.isSelected()||chckbxStaffMed.isSelected()) cds.cdLabel("Admin");
			 if(chckbxStudentCd.isSelected()) cds.studentCD();
			 if(chckbxPowerschool.isSelected()) cds.powerschool();
			 if(chckbxSasi.isSelected()) cds.SASI();
			 if(chckbxDestiny.isSelected()) {cds.cdLabel("Library"); cds.destiny();}
			 if(chckbxStaffMed.isSelected()||chckbxStaffLarge.isSelected()) staffExport();
		}
		if(outputPath!=null)
		{
			if(pressed==btnDeliveryEnvelope)
			{
				deliveryEnvelope();
			}
			if(pressed==btnSchoolDirectory)
			{
				SchoolDirectoryGUI directoryGUI = new SchoolDirectoryGUI(students,schoolPath,schoolData.schoolName,outputPath);
				window.add(directoryGUI);
				directoryGUI.moveToFront();
			}
			if(pressed==btnMissingReport)
			{
				new MissingReportGenerator(students.getStudents(),schoolData,outputPath);
			}
			if(pressed==btnCreateIds)
			{
				IDCardGUI idGUI = new IDCardGUI(outputPath,students,schoolPath,job.stuID,job.facID);
				window.add(idGUI);
				idGUI.moveToFront();
			}
		}else JOptionPane.showMessageDialog(null, "Choose Output Folder.");
	}
	
	private void staffExport()
	{
		ArrayList<Student> staffList = new ArrayList<Student>();
		for(Student s: students.getStudents())
		{
			if(s.grade.equals("FAC")) staffList.add(s);
		}
		File source = null;
		int count = 0;
		if(chckbxStaffMed.isSelected())
		{
			new File(schoolPath+"\\Exports\\StaffMed").mkdirs();
			for(Student s:staffList)
			{
				source = new File(schoolPath+"\\CroppedMed\\"+s.ref+".jpg");
				if(source.exists())
				{
					try {
						Files.copy(source.toPath(), new File(schoolPath+"\\Exports\\StaffMed\\"+s.last+"_"+s.first+"_"+count+".jpg").toPath());
						count++;
					} catch (IOException e) {
						JOptionPane.showMessageDialog(null, "Error Exporting: "+s.ref+" Error: "+e.getMessage());
					}
				}
			}
		}
		if(chckbxStaffLarge.isSelected())
		{
			new File(schoolPath+"\\Exports\\StaffLarge").mkdirs();
			for(Student s:staffList)
			{
				source = new File(schoolPath+"\\CroppedLarge\\"+s.ref+".jpg");
				if(source.exists())
				{
					try {
						Files.copy(source.toPath(), new File(schoolPath+"\\Exports\\StaffLarge\\"+s.last+"_"+s.first+"_"+count+".jpg").toPath());
						count++;
					} catch (IOException e) {
						JOptionPane.showMessageDialog(null, "Error Exporting: "+s.ref+" Error: "+e.getMessage());
					}
				}
			}
		}
	}
	private void deliveryEnvelope()
	{
		try
		{
			BufferedImage envelope = ImageIO.read(new File("Templates\\FALL\\Delivery_Form1.jpg"));
			Graphics2D eG = envelope.createGraphics();
			eG.setColor(Color.black);
			int fontSize = 200, width;
			eG.setFont(new Font("Myriad Pro",Font.PLAIN,fontSize));
			FontMetrics fm = eG.getFontMetrics();
			width = fm.stringWidth(schoolData.schoolName);
			while(width>2400)
			{
				fontSize--;
				eG.setFont(new Font("Myriad Pro",Font.PLAIN,fontSize));
				fm = eG.getFontMetrics();
				width = fm.stringWidth(schoolData.schoolName);
			}
			eG.drawString(schoolData.schoolName, 300, 1000);
			ImageIO.write(envelope, "jpg", new File(outputPath+"\\"+schoolData.trecsName+"_Envelope1.jpg"));
			envelope.flush();
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error: "+e.getMessage());}	
	}
}
