package photo.software.student;

import java.awt.Dimension;
import java.awt.Image;

import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.ImageIcon;
import javax.swing.JComponent;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.JLabel;
import javax.swing.JComboBox;
import javax.swing.JCheckBox;
import javax.swing.KeyStroke;
import javax.swing.ScrollPaneConstants;
import javax.swing.UIManager;

import java.awt.Font;

import javax.swing.JTextPane;
import javax.swing.JScrollPane;
import javax.swing.JButton;

import photo.software.admin.AdminItems1GUI;
import photo.software.admin.AdminItems2GUI;
import photo.software.admin.BarcodeListMakerGUI;
import photo.software.admin.HomeroomCount;
import photo.software.admin.ImageExportGUI;
import photo.software.admin.MissingReportGenerator;
import photo.software.admin.SmallCrops;
import photo.software.admin.StickerGUI;
import photo.software.admin.cards.HolidayCardGUI;
import photo.software.admin.id.IDCardGUI;
import photo.software.composites.CompositeGUI;
import photo.software.event.folder.ChooseImageFolder;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.login.SchoolData;
import photo.software.onsite.CreateOnsiteSetup;
import photo.software.onsite.OnsiteDataMerge;
import photo.software.onsite.PrepCropRenameImages;
import photo.software.orders.DataEntryGUI;
import photo.software.orders.plans.PackagePlanGUI;
import photo.software.render.RenderOrderGUI;
import photo.software.sports.MemoryMateGUI;
import photo.software.student.capture.CaptureGUI;
import photo.software.student.capture.DisplayEnvelopesGUI;
import photo.software.student.capture.EndOfDay;
import photo.software.student.file.CameraCardGUI;
import photo.software.student.lists.ListMakerGUI;
import photo.software.verify.DataVerifyGUI;

import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JMenuBar;
import javax.swing.JMenu;
import javax.swing.JMenuItem;
import javax.swing.border.TitledBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.table.DefaultTableModel;
import javax.swing.text.AbstractDocument;
import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;
import javax.swing.text.DocumentFilter;
import javax.swing.JTable;

@SuppressWarnings("serial")
public class StudentGUI extends JInternalFrame implements ActionListener
{
	public String schoolPath;//schoolName;
	
	private JLabel lblRef;
	private JTextField textField,textField_1,textField_2,textField_3,textField_4,textField_5,textField_6;
	public Student current;
	private JComboBox<String> comboBox,comboBox_1,comboBox_2,comboBox_3;
	private JCheckBox chckbxPhotod,chckbxOrderPaid,chckbxOrderPaid_1;
	private JButton btnPrevious,btnNext;
	private JTextPane textPane;
	private Students students;
	private String[] GRADES = {"","EXMPT","FAC","PRE","TK","KIN","01","02","03","04","05","06",
									"07","08","09","10","11","12","13","14","15"};
	private DesktopWindow window;
	private JobData job;
	private SchoolData schoolData;
	private JMenuBar menuBar;
	private JMenu mnFile;
	private JMenu mnStudent;
	private JMenu mnAdmin;
	private JMenuItem mntmAddBlankRecords;
	private JMenuItem mntmClose;
	private JPanel panel_1,searchPanel;
	private JButton btnSave;
	
	private File imageFile,searchFile;
	private JLabel imageLabel,searchLabel;
	
	BufferedImage stuImage;
	Image scaledImage;
	
	
	private ArrayList<Student> allStudents,foundList;
	
	private JLabel lblSearch;
	private JTextField textField_7;
	private JLabel lblCategory;
	
	private JTable table;
	private JScrollPane scrollPane_1;
	private DefaultTableModel model;
	private String[] columnNames = {"Reference","Last","First","ID#","Grade","Teacher"};
	private String[][] tempTableArray;
	private JPanel searchPanelImage;
	private JPanel searchPanelTable;
	private JPanel searchPanelBox;
	
	public ArrayList<String> homerooms, tracks;
	private JMenuItem mntmAddStudents;
	private JMenuItem mntmStudentLists;
	private JMenuItem mntmCreateOnsiteSetup;
	private JMenuItem mntmCreateCameraCards;
	private JMenuItem mntmCreateEndOf;
	private JMenuItem mntmStudentCapture;
	private JMenuItem mntmOnsitedatamerger;
	private JMenuItem mntmPrepImagesNames;
	private JMenuItem mntmCreateSmallCrops;
	private JMenuItem mntmGenerateMissingReport;
	private JMenuItem mntmHomeroomCount;
	private JMenuItem mntmCreateComposites;
	private JMenuItem mntmImageExport;
	private JMenuItem mntmIdCardMaker;
	private JMenuItem mntmDataEntry;
	private JButton btnViewEnvelopes;
	private JMenuItem mntmPackageplans;
	private JMenuItem mntmRenderPackages;
	private JButton btnOrderForm;
	private JMenuItem mntmStickerPrints;
	private JMenuItem mntmUpdatePhotod;
	private JMenuItem mntmCreateSelectivelist;
	private JMenuItem mntmVerifystudentdata;
	private JMenuItem mntmMemoryMateBuilder;
	private JMenuItem mntmExportStudentsFor;
	private JMenuItem mntmAdminItemsBefore;
	private JMenuItem mntmAdminItemsAfter;
	private JMenu mnOnSiteOptions;
	private JMenu mnTools;
	private JMenuItem mntmHolidayCardCreator;
	private JMenuItem mntmBarcodeListMaker;
	private JMenuItem mntmSportsChooseImage;
	private JMenuItem mntmTestFunctions;
	

	public StudentGUI(DesktopWindow window, JobData job, SchoolData schoolData,Students students) 
	{
		this.window = window;
		this.job = job;
		this.schoolData = schoolData;
		this.students = students;
		//this.schoolName = schoolData.schoolName;
		schoolPath = window.jobs+"\\"+job.location+"\\"+job.job;
		
		initialize();

		current = null;
		students.open();
		allStudents = students.getStudents();
		initializeComboBoxes();
		if(students.size()>0)
		{
			current = students.setCurrentStudent(job.refNum);
			loadCurrent();
			this.students.loadListDatabase();
		}
		textField_7.setText(" ");
		textField_7.setText("");
	}
	//public String getSchoolName()
	//{
	//	return schoolName;
	//}
	public Students getStudents()
	{
		return students;
	}
	private void initializeComboBoxes()
	{
		homerooms = new ArrayList<String>();
		tracks = new ArrayList<String>();
		homerooms.add("");
		tracks.add("");
		for(Student s: allStudents)
		{
			if(!homerooms.contains(s.homeroom)) homerooms.add(s.homeroom);
			if(!tracks.contains(s.track)) tracks.add(s.track);
		}
		Collections.sort(homerooms);
		Collections.sort(tracks);
		comboBox_1.removeAllItems();
		comboBox_2.removeAllItems();
		for(String h:homerooms) comboBox_1.addItem(h);
		for(String t:tracks) comboBox_2.addItem(t);
	}
	private void saveCurrent(Boolean override)
	{
		boolean needToSave = false;
		boolean updateComboBoxes = false;
		if(!current.first.equals(textField.getText())){current.first = textField.getText().trim();needToSave = true;}
		if(!current.last.equals(textField_1.getText())){current.last = textField_1.getText().trim();needToSave = true;}
		if(!current.ID.equals(textField_2.getText())){current.ID = textField_2.getText().trim();needToSave = true;}
		if(!current.grade.equals(comboBox.getSelectedItem())){current.grade = (String)comboBox.getSelectedItem();needToSave = true;}
		if(!current.homeroom.equals(comboBox_1.getSelectedItem()))
		{
			current.homeroom = (String)comboBox_1.getSelectedItem();needToSave = true;
			updateComboBoxes = true;
		}
		if(!current.track.equals(comboBox_2.getSelectedItem()))
		{
			current.track = (String)comboBox_2.getSelectedItem();needToSave = true;
			updateComboBoxes = true;
		}
		if(!current.photo.equals(chckbxPhotod.isSelected()+"")){current.photo = chckbxPhotod.isSelected()+"";needToSave = true;}
		if(!current.field1.equals(textField_5.getText())){current.field1 = textField_5.getText().trim();needToSave = true;}
		if(!current.field2.equals(textField_6.getText())){current.field2 = textField_6.getText().trim();needToSave = true;}
		if(!current.notes.equals(textPane.getText())){current.notes = textPane.getText().trim();needToSave = true;}
		if(!current.order1.equals(textField_3.getText())){current.order1 = textField_3.getText().trim();needToSave = true;}
		if(!current.order2.equals(textField_4.getText())){current.order2 = textField_4.getText().trim();needToSave = true;}
		if(!current.order1Pay.equals(chckbxOrderPaid.isSelected()+"")){current.order1Pay = chckbxOrderPaid.isSelected()+"";needToSave = true;}
		if(!current.order2Pay.equals((chckbxOrderPaid_1.isSelected()+""))){current.order2Pay = chckbxOrderPaid_1.isSelected()+"";needToSave = true;}
		if(needToSave||override)
		{
			students.saveStudent(current);
			students.setCurrentStudent(current.ref);
			allStudents = students.getStudents();
			if(updateComboBoxes) initializeComboBoxes();
			/*
			 * I don't think this actually does anything...
			if(students.currentIndex<=model.getRowCount())
			{
				if(model.getValueAt(students.currentIndex, 0).equals(current.ref))
				{
					model.setValueAt(current.last, students.currentIndex, 1);
					model.setValueAt(current.first, students.currentIndex, 2);
					model.setValueAt(current.ID, students.currentIndex, 3);
					model.setValueAt(current.grade, students.currentIndex, 4);
					model.setValueAt(current.homeroom, students.currentIndex, 5);
					return;
				}
			}*/
			for(int i=0;i<model.getRowCount();i++)
			{
				if(model.getValueAt(i, 0).equals(current.ref))
				{
					model.setValueAt(current.last, i, 1);
					model.setValueAt(current.first, i, 2);
					model.setValueAt(current.ID, i, 3);
					model.setValueAt(current.grade, i, 4);
					model.setValueAt(current.homeroom, i, 5);
					return;
				}
			}	
		}
	}
	private void loadCurrent()
	{
		current = students.current;
		lblRef.setText("Ref #: "+current.ref);
		textField.setText(current.first);
		textField_1.setText(current.last);
		textField_2.setText(current.ID);
		comboBox.setSelectedItem(current.grade);
		comboBox_1.setSelectedItem(current.homeroom);
		comboBox_2.setSelectedItem(current.track);
		chckbxPhotod.setSelected(Boolean.parseBoolean(current.photo));
		textField_5.setText(current.field1);
		textField_6.setText(current.field2);
		textPane.setText(current.notes);
		textField_3.setText(current.order1);
		textField_4.setText(current.order2);
		chckbxOrderPaid.setSelected(Boolean.parseBoolean(current.order1Pay));
		chckbxOrderPaid_1.setSelected(Boolean.parseBoolean(current.order2Pay));
		loadThumbnail();
	}
	private void loadThumbnail()
	{
		panel_1.removeAll();
		imageFile = new File(schoolPath+"\\CroppedMed\\"+current.ref+".jpg");
		if(chckbxPhotod.isSelected()&&imageFile.exists())
		{
			try {
				stuImage = ImageIO.read(imageFile);
				scaledImage = stuImage.getScaledInstance(340, -1, Image.SCALE_FAST);
				imageLabel = new JLabel(new ImageIcon(scaledImage));
				panel_1.add(imageLabel);
				stuImage.flush();
				scaledImage.flush();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		panel_1.updateUI();
	}
	public boolean updateFromOrderForm(Student formStudent)
	{
		if(current.ref.equals(formStudent.ref))
		{
			textField.setText(formStudent.first);
			textField_1.setText(formStudent.last);
			textField_3.setText(formStudent.order1);
			textField_4.setText(formStudent.order2);
			chckbxOrderPaid.setSelected(Boolean.parseBoolean(formStudent.order1Pay));
			chckbxOrderPaid_1.setSelected(Boolean.parseBoolean(formStudent.order2Pay));
			textPane.setText(formStudent.notes);
			saveCurrent(true);
			return true;
		}
		else JOptionPane.showMessageDialog(null, "StudentGUI student does not match OrderFormGUI student");
		return false;
	}
	public void initialize()
	{
		UpcaseFilter upper = new UpcaseFilter();
		setBounds(100, 100, 1200, 855);
		this.setLocation(0, 0);
		getContentPane().setLayout(new MigLayout("", "[750.00][360.00]", "[466.00][325.00]"));
		
		JPanel panel = new JPanel();
		panel.setBorder(new TitledBorder(UIManager.getBorder("TitledBorder.border"), "Current Student", TitledBorder.CENTER, TitledBorder.TOP, null, new Color(0, 0, 0)));
		getContentPane().add(panel, "cell 0 0,grow");
		panel.setLayout(new MigLayout("", "[209.00][210.00][285.00]", "[][][][25.00][][25.00][][25.00][][25.00][][][][][]"));
		
		JLabel lblSchoolName = new JLabel(job.location+" "+job.job);
		lblSchoolName.setFont(new Font("Tahoma", Font.PLAIN, 22));
		panel.add(lblSchoolName, "cell 0 0 3 1,alignx left");
		
		lblRef = new JLabel("Ref #:");
		lblRef.setForeground(Color.RED);
		lblRef.setFont(new Font("Tahoma", Font.PLAIN, 22));
		panel.add(lblRef, "cell 0 1 3 1,alignx left");
		
		textField_1 = new JTextField();
		((AbstractDocument) textField_1.getDocument()).setDocumentFilter(upper);
		textField_1.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(textField_1, "cell 0 2,growx");
		textField_1.setColumns(10);
		
		textField_2 = new JTextField();
		((AbstractDocument) textField_2.getDocument()).setDocumentFilter(upper);
		
		JLabel lblLast = new JLabel("Last");
		lblLast.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(lblLast, "cell 0 3,alignx center,aligny top");
		textField_2.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(textField_2, "cell 0 4,growx");
		textField_2.setColumns(10);
		
		comboBox = new JComboBox<String>();
		for(String s:GRADES) comboBox.addItem(s);
		comboBox.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(comboBox, "flowx,cell 1 4,growx");
		
		JLabel lblIdNumber = new JLabel("ID Number");
		lblIdNumber.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(lblIdNumber, "cell 0 5,alignx center,aligny top");
		
		JLabel lblGrade = new JLabel("      Grade");
		lblGrade.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(lblGrade, "cell 1 5,alignx left,aligny top");
		
		comboBox_1 = new JComboBox<String>();
		((AbstractDocument) ((JTextField) comboBox_1.getEditor().getEditorComponent()).getDocument()).setDocumentFilter(upper);
		comboBox_1.setEditable(true);
		comboBox_1.addItem("");
		comboBox_1.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(comboBox_1, "cell 0 6,growx");
		
		comboBox_2 = new JComboBox<String>();
		((AbstractDocument) ((JTextField) comboBox_2.getEditor().getEditorComponent()).getDocument()).setDocumentFilter(upper);
		comboBox_2.setEditable(true);
		comboBox_2.addItem("");
		comboBox_2.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(comboBox_2, "cell 1 6,growx");
		
		JScrollPane scrollPane = new JScrollPane();
		scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
		panel.add(scrollPane, "cell 2 4 1 6,grow");
		
		textPane = new JTextPane();
		scrollPane.setViewportView(textPane);
		
		JLabel lblHomeroom = new JLabel("Homeroom");
		lblHomeroom.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(lblHomeroom, "cell 0 7,alignx center,aligny top");
		
		JLabel lblTrack = new JLabel("Track");
		lblTrack.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(lblTrack, "cell 1 7,alignx center,aligny top");
		
		textField_5 = new JTextField();
		textField_5.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(textField_5, "cell 0 8,growx");
		textField_5.setColumns(10);
		
		textField_6 = new JTextField();
		textField_6.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(textField_6, "cell 1 8,growx");
		textField_6.setColumns(10);
		
		JLabel lblField = new JLabel("Field1");
		lblField.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(lblField, "cell 0 9,alignx center,aligny top");
		
		JLabel lblField_1 = new JLabel("Field2");
		lblField_1.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(lblField_1, "cell 1 9,alignx center,aligny top");
		
		chckbxPhotod = new JCheckBox("Photo'd");
		chckbxPhotod.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(chckbxPhotod, "cell 1 4");
		
		JLabel lblNotes = new JLabel("Notes");
		lblNotes.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(lblNotes, "cell 2 10,alignx center,aligny top");
		
		textField_3 = new JTextField();
		textField_3.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(textField_3, "cell 0 11,growx");
		textField_3.setColumns(10);
		
		textField_4 = new JTextField();
		textField_4.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(textField_4, "cell 1 11,growx");
		textField_4.setColumns(10);
		
		btnViewEnvelopes = new JButton("View Envelopes");
		btnViewEnvelopes.addActionListener(this);
		btnViewEnvelopes.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(btnViewEnvelopes, "cell 2 11,grow");
		
		chckbxOrderPaid = new JCheckBox("Order 1 Paid");
		chckbxOrderPaid.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(chckbxOrderPaid, "cell 0 12,alignx center");
		
		chckbxOrderPaid_1 = new JCheckBox("Order 2 Paid");
		chckbxOrderPaid_1.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(chckbxOrderPaid_1, "cell 1 12,alignx center");
		
		btnPrevious = new JButton("Previous");
		btnPrevious.addActionListener(this);
		btnPrevious.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(btnPrevious, "cell 0 14,growx");
		
		btnOrderForm = new JButton("Order Form");
		btnOrderForm.addActionListener(this);
		btnOrderForm.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(btnOrderForm, "cell 2 12,growx");
		
		btnNext = new JButton("Next");
		btnNext.addActionListener(this);
		btnNext.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(btnNext, "cell 1 14,growx");
		
		btnSave = new JButton("Save");
		btnSave.addActionListener(this);
		btnSave.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(btnSave, "cell 2 14,growx");
		
		textField = new JTextField();
		((AbstractDocument) textField.getDocument()).setDocumentFilter(upper);
		textField.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(textField, "cell 1 2,growx");
		textField.setColumns(10);
		
		JLabel lblFirst = new JLabel("First");
		lblFirst.setFont(new Font("Tahoma", Font.PLAIN, 13));
		panel.add(lblFirst, "cell 1 3,alignx center,aligny top");
		
		panel_1 = new JPanel();
		panel_1.setBorder(new TitledBorder(UIManager.getBorder("TitledBorder.border"), "Student Image", TitledBorder.CENTER, TitledBorder.TOP, null, new Color(0, 0, 0)));
		getContentPane().add(panel_1, "cell 1 0,grow");
		
		
		
		//////////////////////////////Search Panel///////////////////////////
		searchPanel = new JPanel();
		searchPanel.setBorder(new TitledBorder(UIManager.getBorder("TitledBorder.border"), "Search For Student", TitledBorder.CENTER, TitledBorder.TOP, null, new Color(0, 0, 0)));
		getContentPane().add(searchPanel, "cell 0 1 2 1,grow");
		searchPanel.setLayout(new MigLayout("", "[775.00][300.00]", "[][260.00]"));
		
		/////Search Panel Options/////
		searchPanelBox = new JPanel();
		searchPanel.add(searchPanelBox, "cell 0 0,grow");
		searchPanelBox.setLayout(new MigLayout("", "[][131.00][93.00][357.00]", "[]"));
		
		lblSearch = new JLabel("Search:");
		searchPanelBox.add(lblSearch, "cell 0 0,alignx trailing");
		
		textField_7 = new JTextField();
		textField_7.addActionListener(this);
		textField_7.getDocument().addDocumentListener(new DocumentListener() {
			  public void changedUpdate(DocumentEvent e) {
					search();
					updateTable();
			  }
			  public void removeUpdate(DocumentEvent e) {
					search();
					updateTable();
			  }
			  public void insertUpdate(DocumentEvent e) {
					search();
					updateTable();
			  }});
		textField_7.setColumns(10);
		((AbstractDocument) textField_7.getDocument()).setDocumentFilter(upper);
		searchPanelBox.add(textField_7, "cell 1 0,growx");
		
		lblCategory = new JLabel("Category:");
		searchPanelBox.add(lblCategory, "cell 2 0,alignx trailing");
		
		comboBox_3 = new JComboBox<String>();
		String[] searchChoices = {"Last Name","First Name","ID#","Homeroom","Grade","Ref Number"};
		for(String s:searchChoices) comboBox_3.addItem(s);
		searchPanelBox.add(comboBox_3, "cell 3 0,growx");
		
		/////Search Table/////
		searchPanelTable = new JPanel();
		searchPanel.add(searchPanelTable, "cell 0 1,grow");
				
		/////Search Image/////
		searchPanelImage = new JPanel();
		searchPanel.add(searchPanelImage, "cell 1 0 1 2,grow");
		
		menuBar = new JMenuBar();
		setJMenuBar(menuBar);
		
		mnFile = new JMenu("File");
		menuBar.add(mnFile);
		
		mntmClose = new JMenuItem("Close");
		mntmClose.addActionListener(this);
		
		mntmCreateEndOf = new JMenuItem("Create End of Day");
		mntmCreateEndOf.addActionListener(this);
		mnFile.add(mntmCreateEndOf);
		mnFile.add(mntmClose);
		
		mnStudent = new JMenu("Student");
		menuBar.add(mnStudent);
		
		mntmAddBlankRecords = new JMenuItem("Add Blank Records");
		mntmAddBlankRecords.addActionListener(this);
		
		mntmStudentCapture = new JMenuItem("Student Capture");
		mntmStudentCapture.addActionListener(this);
		mnStudent.add(mntmStudentCapture);
		mnStudent.add(mntmAddBlankRecords);
		
		mntmAddStudents = new JMenuItem("Add Students");
		mntmAddStudents.addActionListener(this);
		mnStudent.add(mntmAddStudents);
		
		mntmStudentLists = new JMenuItem("Student Lists");
		mntmStudentLists.addActionListener(this);
		mnStudent.add(mntmStudentLists);
		
		mntmCreateSelectivelist = new JMenuItem("Create SelectiveList");
		mntmCreateSelectivelist.addActionListener(this);
		
		mntmBarcodeListMaker = new JMenuItem("Barcode List Maker");
		mntmBarcodeListMaker.addActionListener(this);
		mnStudent.add(mntmBarcodeListMaker);
		mnStudent.add(mntmCreateSelectivelist);
		
		mntmVerifystudentdata = new JMenuItem("VerifyStudentData");
		mntmVerifystudentdata.addActionListener(this);
		mnStudent.add(mntmVerifystudentdata);
		
		mntmUpdatePhotod = new JMenuItem("Update Photo'd");
		mntmUpdatePhotod.addActionListener(this);
		mnStudent.add(mntmUpdatePhotod);
		
		mntmSportsChooseImage = new JMenuItem("Sports Choose Image Folder");
		mntmSportsChooseImage.addActionListener(this);
		mnStudent.add(mntmSportsChooseImage);
		
		mnAdmin = new JMenu("Admin");
		menuBar.add(mnAdmin);
		
		mnTools = new JMenu(" Tools");
		mnAdmin.add(mnTools);
		
		mntmIdCardMaker = new JMenuItem("ID Card Maker");
		mnTools.add(mntmIdCardMaker);
		mntmIdCardMaker.addActionListener(this);
		
				mntmCreateComposites = new JMenuItem("Create Composites");
				mnTools.add(mntmCreateComposites);
				mntmCreateComposites.addActionListener(this);
				
				mntmImageExport = new JMenuItem("Image Export");
				mnTools.add(mntmImageExport);
				mntmImageExport.addActionListener(this);
				
				mntmHolidayCardCreator = new JMenuItem("Holiday Card Creator");
				mnTools.add(mntmHolidayCardCreator);
				mntmHolidayCardCreator.addActionListener(this);
				
				mntmPackageplans = new JMenuItem("PackagePlans");
				mnTools.add(mntmPackageplans);
				mntmPackageplans.addActionListener(this);
				
				mntmStickerPrints = new JMenuItem("Sticker Prints");
				mnTools.add(mntmStickerPrints);
				mntmStickerPrints.addActionListener(this);
				
				mntmHomeroomCount = new JMenuItem("Homeroom Count");
				mnTools.add(mntmHomeroomCount);
				mntmHomeroomCount.addActionListener(this);
				
				mntmExportStudentsFor = new JMenuItem("Export Students for Certificates");
				mnTools.add(mntmExportStudentsFor);
				mntmExportStudentsFor.addActionListener(this);
				
				mntmGenerateMissingReport = new JMenuItem("Generate Missing Report");
				mnTools.add(mntmGenerateMissingReport);
				
				mntmMemoryMateBuilder = new JMenuItem("MemoryMate Builder");
				mnTools.add(mntmMemoryMateBuilder);
				
				mntmTestFunctions = new JMenuItem("Test Functions");
				mntmTestFunctions.addActionListener(this);
				mnTools.add(mntmTestFunctions);
				mntmMemoryMateBuilder.addActionListener(this);
				mntmGenerateMissingReport.addActionListener(this);
		
		mnOnSiteOptions = new JMenu("On Site Options");
		mnAdmin.add(mnOnSiteOptions);
		
		mntmCreateOnsiteSetup = new JMenuItem("Create Onsite Setup");
		mnOnSiteOptions.add(mntmCreateOnsiteSetup);
		mntmCreateOnsiteSetup.addActionListener(this);
		
		mntmCreateCameraCards = new JMenuItem("Create Camera Cards");
		mnOnSiteOptions.add(mntmCreateCameraCards);
		mntmCreateCameraCards.addActionListener(this);
		
		mntmOnsitedatamerger = new JMenuItem("OnSiteDataMerger");
		mnOnSiteOptions.add(mntmOnsitedatamerger);
		
		mntmPrepImagesNames = new JMenuItem("Prep Images Names");
		mnOnSiteOptions.add(mntmPrepImagesNames);
		
		mntmCreateSmallCrops = new JMenuItem("Create Small Crops");
		mnOnSiteOptions.add(mntmCreateSmallCrops);
		
		
		mntmCreateSmallCrops.addActionListener(this);
		mntmPrepImagesNames.addActionListener(this);
		mntmOnsitedatamerger.addActionListener(this);
		
		mntmAdminItemsBefore = new JMenuItem("Admin Items Before Makeupday");
		mntmAdminItemsBefore.addActionListener(this);
		mnAdmin.add(mntmAdminItemsBefore);
		
		mntmAdminItemsAfter = new JMenuItem("Admin Items After Makeupday");
		mntmAdminItemsAfter.addActionListener(this);
		mnAdmin.add(mntmAdminItemsAfter);
		
		mntmDataEntry = new JMenuItem("Data Entry");
		mntmDataEntry.addActionListener(this);
		mnAdmin.add(mntmDataEntry);
		
		mntmRenderPackages = new JMenuItem("Render Packages");
		mntmRenderPackages.addActionListener(this);
		mnAdmin.add(mntmRenderPackages);
				
		this.setVisible(true);
	}
	public void updateTable()
	{
		model = new DefaultTableModel(tempTableArray,columnNames){
			@Override
			public boolean isCellEditable(int row, int column){
				return false;
			}
		};
		table = new JTable(model);
		table.addMouseListener(new MouseAdapter(){
			public void mousePressed(MouseEvent e){
				updateSearchPicture(tempTableArray[table.getSelectedRow()][0]);
			}
			public void mouseClicked(MouseEvent e)
			{
				if(e.getClickCount()==2)
				{
					saveCurrent(false);
					students.search(tempTableArray[table.getSelectedRow()][0]);
					loadCurrent();
				}
			}
		});
		table.addKeyListener(new KeyAdapter(){
			public void keyPressed(KeyEvent e)
			{
				if((e.getKeyCode()==KeyEvent.VK_ENTER)&&(table.getSelectedRow()!=-1))
				{
					saveCurrent(false);
					students.search(tempTableArray[table.getSelectedRow()][0]);
					loadCurrent();
				}
			}
		});
		table.setPreferredScrollableViewportSize(new Dimension(650, 200));
		table.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0), "Enter");

		searchPanelTable.removeAll();
		scrollPane_1 = new JScrollPane(table);
		searchPanelTable.add(scrollPane_1);
		searchPanelTable.updateUI();
	}
	private void search()
	{
		String value = textField_7.getText();
		foundList = new ArrayList<Student>();
		
		searchPanelImage.removeAll();
		
		switch(comboBox_3.getSelectedIndex())
		{
			case 0: 
				for(Student s:allStudents)
					if(s.last.contains(value))
						foundList.add(s);
				break;
			case 1:
				for(Student s:allStudents)
					if(s.first.contains(value))
						foundList.add(s);
				break;
			case 2:
				for(Student s:allStudents)
					if(s.ID.contains(value))
						foundList.add(s);
				break;
			case 3:
				for(Student s:allStudents)
					if(s.homeroom.contains(value))
						foundList.add(s);
				break;
			case 4:
				for(Student s:allStudents)
					if(s.grade.equals(value))
						foundList.add(s);
				break;
			case 5:
				for(Student s:allStudents)
					if(s.ref.contains(value))
						foundList.add(s);
		}
		tempTableArray= new String[foundList.size()][6];
		for(int i=0;i<foundList.size();i++)
		{
			tempTableArray[i][0]=foundList.get(i).ref;
			tempTableArray[i][1]=foundList.get(i).last;
			tempTableArray[i][2]=foundList.get(i).first;
			tempTableArray[i][3]=foundList.get(i).ID;
			tempTableArray[i][4]=foundList.get(i).grade;
			tempTableArray[i][5]=foundList.get(i).homeroom;
		}
	}
	private void updateSearchPicture(String ref)
	{
		searchPanelImage.removeAll();
		searchFile = new File(schoolPath+"\\CroppedMed\\"+ref+".jpg");
		if(searchFile.exists())
		{
			try 
			{
				stuImage = ImageIO.read(searchFile);
				scaledImage = stuImage.getScaledInstance(200, -1, Image.SCALE_FAST);
				searchLabel = new JLabel(new ImageIcon(scaledImage));
				searchPanelImage.add(searchLabel);
				stuImage.flush();
				scaledImage.flush();
			} catch (IOException e) {JOptionPane.showMessageDialog(null, "Unable to display search picture... Odd..:"+e);}
		}
		searchPanelImage.updateUI();
	}
	public void addStudents(ArrayList<Student> studentsToAdd)
	{
		if(students.addStudents(studentsToAdd)) JOptionPane.showMessageDialog(null, "SUCCESS!");
		else JOptionPane.showMessageDialog(null, "FAIL!");
		allStudents = students.getStudents();
	}
	public void addBlank(int add)
	{
		students.addBlank(add);
		allStudents = students.getStudents();
	}
	private void showEnvelope()
	{
		File envelopeFolder = new File(schoolPath+"\\Envelopes");
		ArrayList<File> orderEnvelopes = new ArrayList<File>();
		if(envelopeFolder.exists())
		{
			File[] envelopes = envelopeFolder.listFiles();
			for(File e: envelopes)
			{
				if(e.getName().contains(current.ref)) orderEnvelopes.add(e);
			}
		}
		if(orderEnvelopes.size()==0) JOptionPane.showMessageDialog(null,"No Envelopes for current Reference Number");
		else
		{
			window.add(new DisplayEnvelopesGUI(orderEnvelopes));
			this.moveToBack();
		}
	}
	@Override
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		if(pressed==btnPrevious)
		{
			saveCurrent(false);
			students.previous();
			loadCurrent();
		}
		else if(pressed==btnNext)
		{
			saveCurrent(false);
			students.next();
			loadCurrent();
		}
		else if(pressed==btnSave)
		{
			saveCurrent(false);
			loadCurrent();
		}
		else if(pressed==btnOrderForm)
		{
			window.add(new OrderFormGUI(schoolPath,job,current,this));
			this.moveToBack();
		}
		else if(pressed==btnViewEnvelopes)
		{
			showEnvelope();
		}
		//////////MENU////////
		//////File/////
		else if(pressed==mntmCreateCameraCards)
		{
			window.add(new CameraCardGUI(this,students,schoolData));
			this.moveToBack();
		}
		else if(pressed==mntmClose)
		{
			close();
			window.chooseJob();
		}
		else if(pressed==mntmAddBlankRecords)
		{
			int c=0;
			String count = JOptionPane.showInputDialog(null, "How Many Blank Records? ");
			try{c=Integer.parseInt(count);}catch(NumberFormatException e){JOptionPane.showMessageDialog(null, "Not a valid Number.");}
			addBlank(c);
			textField_7.setText(" ");
			textField_7.setText("");
		}
		else if(pressed==mntmAddStudents)
		{
			window.add(new AddStudentsGUI(schoolPath,this));
			this.moveToBack();
		}
		else if(pressed==mntmStudentLists)
		{
			window.add(new ListMakerGUI(students, schoolData.schoolName));
			this.moveToBack();
		}
		else if(pressed==mntmCreateOnsiteSetup)
		{
			saveCurrent(false);
			students.close();
			new CreateOnsiteSetup(schoolPath,job);
			students.open();
		}
		else if(pressed==mntmCreateEndOf)
		{
			int confirm = JOptionPane.showConfirmDialog(null, "Are you sure you want to create an end of day?");
			if(confirm==JOptionPane.YES_OPTION)
			{
				saveCurrent(false);
				students.close();
				new EndOfDay(schoolPath,window.user,job.location);
				students.open();
			}
		}
		else if(pressed==mntmOnsitedatamerger)
		{
			saveCurrent(false);
			new OnsiteDataMerge(students,schoolPath);
			students.setCurrentStudent(job.refNum);
			loadCurrent();
		}
		else if(pressed==mntmPrepImagesNames)
		{
			new PrepCropRenameImages();
		}
		else if(pressed==mntmSportsChooseImage)
		{
			int areYouSure = JOptionPane.showConfirmDialog(null, "Are you sure you want to choose the folder?\nIf there is data already on the excel file this will wipe it.");
			if(areYouSure==JOptionPane.YES_OPTION) new ChooseImageFolder(false, Integer.parseInt(job.refNum));
		}
		else if(pressed==mntmCreateSmallCrops)
		{
			new SmallCrops();
		}
		else if(pressed==mntmStudentCapture)
		{
			close();
			window.add(new CaptureGUI(window,job,schoolData,students));
		}
		else if(pressed==mntmAdminItemsBefore)
		{
			window.add(new AdminItems1GUI(window, students, schoolData, schoolPath, job));
			this.moveToBack();
		}
		else if(pressed==mntmAdminItemsAfter)
		{
			window.add(new AdminItems2GUI(window, students, schoolData, schoolPath, job));
			this.moveToBack();
		}
		else if(pressed==mntmGenerateMissingReport)
		{
			new MissingReportGenerator(students.getStudents(),schoolData, schoolPath);
		}
		else if(pressed==mntmHomeroomCount)
		{
			new HomeroomCount(students.getStudents(),schoolData.schoolName,schoolPath);
		}
		else if(pressed==mntmImageExport)
		{
			saveCurrent(false);
			window.add(new ImageExportGUI(students,schoolPath,schoolData.schoolName));
			this.moveToBack();
		}
		else if(pressed==mntmHolidayCardCreator)
		{
			saveCurrent(false);
			window.add(new HolidayCardGUI(students,schoolPath,schoolData.schoolName));
			this.moveToBack();
		}
		else if(pressed==mntmIdCardMaker)
		{
			saveCurrent(false);
			window.add(new IDCardGUI(students,schoolPath,current.ref,job.stuID,job.facID));
			this.moveToBack();
		}
		else if(pressed==mntmStickerPrints)
		{
			window.add(new StickerGUI(schoolPath,students));
			this.moveToBack();
		}
		else if(pressed==mntmExportStudentsFor)
		{
			new ExportStudentsForCertificates(students.getStudents(),schoolData);
		}
		else if(pressed==mntmDataEntry)
		{
			close();
			window.add(new DataEntryGUI(window,job,schoolData,students,schoolPath));
		}
		else if(pressed==mntmPackageplans)
		{
			window.add(new PackagePlanGUI(window));
			this.moveToBack();
		}
		else if(pressed==mntmRenderPackages)
		{
			saveCurrent(false);
			window.add(new RenderOrderGUI(students,window,current,homerooms,schoolPath,job,schoolData));
			this.moveToBack();
		}
		else if(pressed==mntmUpdatePhotod)
		{
			File[] largeCropped = (new File(schoolPath+"\\CroppedLarge")).listFiles();
			ArrayList<String> names = new ArrayList<String>();
			for(File f:largeCropped) names.add(f.getName().toUpperCase().replace(".JPG", ""));
			students.markPhotographed(names);
		}
		else if(pressed==mntmCreateComposites)
		{
			window.add(new CompositeGUI(this, schoolData));
			this.moveToBack();
			
		}
		else if(pressed==mntmTestFunctions)
		{
			JOptionPane.showMessageDialog(null, "Nothing in the test functions currently!");
		}
		else if(pressed==mntmCreateSelectivelist)
		{
			/*String[] parse;
			for(Student s:allStudents)
			{
				if(!s.order1.equals(""))
				{
					//parse = s.order1.split("\\.");
					//for(String p:parse)
					{
						//if(p.equals("1")||p.equals("26")) students.addStudentToList("NameOnWallet", s.ref);
						//else if(p.equals("73")) students.addStudentToList("SeniorOption3", s.ref);
						//if(p.equals("1")) students.addStudentToList("ExtraID", s.ref);
						//if(p.equals("8")||p.equals("11")) students.addStudentToList("8&11", s.ref);
					}
				}
			}*/
			JOptionPane.showMessageDialog(null, "THIS DOES NOTHING RIGHT NOW!");
		}
		else if(pressed==mntmBarcodeListMaker)
		{
			window.add(new BarcodeListMakerGUI(students,schoolPath));
			this.moveToBack();
		}
		else if(pressed==mntmVerifystudentdata)
		{
			window.add(new DataVerifyGUI(schoolPath,students,this));
			this.moveToBack();
		}
		else if(pressed==mntmMemoryMateBuilder)
		{
			window.add(new MemoryMateGUI());
			this.moveToBack();
		}
	}
	public DesktopWindow getDesktopWindow()
	{
		return window;
	}
	public void reloadInfo()
	{
		students.close();
		this.dispose();
		window.add(new StudentGUI(window,job,schoolData,students));
	}
	public void close()
	{
		saveCurrent(false);
		students.close();
		this.dispose();
	}
}
class UpcaseFilter extends DocumentFilter{
	  public void insertString(DocumentFilter.FilterBypass fb, int offset,
		      String text, AttributeSet attr) throws BadLocationException {
		    fb.insertString(offset, text.toUpperCase(), attr);
		  }

		  //no need to override remove(): inherited version allows all removals

		  public void replace(DocumentFilter.FilterBypass fb, int offset, int length,
		      String text, AttributeSet attr) throws BadLocationException {
		    fb.replace(offset, length, text.toUpperCase(), attr);
		  }
}
