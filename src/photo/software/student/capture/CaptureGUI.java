package photo.software.student.capture;

import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JPanel;
import javax.swing.border.TitledBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.InternalFrameListener;
import javax.swing.table.DefaultTableModel;
import javax.swing.text.AbstractDocument;
import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;
import javax.swing.text.DocumentFilter;
import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.JComboBox;
import javax.swing.KeyStroke;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GraphicsConfiguration;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.Image;
import java.awt.Transparency;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

import javax.swing.JButton;
import javax.swing.JTextPane;
import javax.swing.JCheckBox;

import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.login.SchoolData;
import photo.software.student.Student;
import photo.software.student.StudentGUI;
import photo.software.student.Students;

import javax.swing.JScrollPane;
import javax.swing.JTable;


@SuppressWarnings("serial")
public class CaptureGUI extends JInternalFrame implements ActionListener
{
	///////////CaptureGUI Variables//////
	private DesktopWindow window;
	private JobData job;
	public SchoolData schoolData;
	private Students students;
	private String schoolPath;
	public Student current;
	public ArrayList<Student> allStudents, foundList;
	public ArrayList<String> homerooms, tracks;
	private UpcaseFilter upper;
	private WatchHotFolder watcher;
	public CaptureLogger log;
	private BufferedImage tempImage;
	private Image scaledImage;
	private int count=0;
	private int stuImageCount=0;
	boolean noImgShotYet = true;
	boolean incorrect;
	String incorrectName;
	File lastImgShot = null;
	private JLabel lastImageLabel, currentCaptureLabel;
	private ArrayList<RefImageLink> imageLinks;
	private ArrayList<RefImageLink> chosenLinks;
	
	///////Current Student Information Variables///////
	private JPanel panel;
	private JTextArea lblRef;
	private JLabel lblFirst, lblLast, lblHomeroom, lblGrade, lblIdNumber, lblTrack, lblNotes;
	private JTextField textField, textField_1, textField_2;
	private JComboBox<String> comboBox, comboBox_1, comboBox_2;
	private JCheckBox chckbxPhotographed;
	private JScrollPane scrollPane;
	private JTextPane textPane;
	private JButton btnEditStudent, btnSaveStudent;
	
	private String[] GRADES = {"","EXMPT","FAC","PRE","TK","KIN","01","02","03","04","05","06",
			"07","08","09","10","11","12","13","14","15"};

	private JPanel current_img_panel, latest_img_panel;

	///Current & Captured Image Variables///
	private File imageFile, left, right;
	private String chosenFile="null";
	private JLabel imageLabel,capturedLabel;
	private Graphics2D gResult;

	///////Search Student Panel Variables/////
	private JPanel searchPanel;
	private JPanel searchPanelBox;
	private JPanel searchPanelImage;
	private JPanel searchPanelTable;
	
	private JLabel lblSearch, lblCategory;
	private JTextField textField_5;
	private JComboBox<String> comboBox_3;
	
	///////Search Table Variables//////
	private JTable table;
	private JScrollPane scrollPane_1;
	private DefaultTableModel model;
	private String[] columnNames = {"Reference","Last","First","ID#","Grade","Teacher"};
	private String[][] tempTableArray;
	
	///Search Image Variables///
	private File searchFile;
	private JLabel searchLabel;
	private JPanel status_panel;
	private JPanel panel_4;
	private JCheckBox chckbxIgnorePhotoLimit;

	/*
	 * CaptureGUI initializes the JInternalFrame.  It assigns all the initial variables, then initializes all the panels.
	 * It opens the Students file and sets the current student.
	 * It begins the watch for new files in the TrecsHotFolder and ensures the folder is initially empty.
	 * It displays the current student and is ready for user input. 
	 */
	public CaptureGUI(DesktopWindow window, JobData job, SchoolData schoolData, Students students)
	{
		setMaximizable(true);
		this.schoolData = schoolData;
		this.window = window;
		this.job = job;
		this.students = students;
		schoolPath = window.jobs+"\\"+job.location+"\\"+job.job;
		log = new CaptureLogger(window.user);
		current = null;
		initialize();
		setPanelEnabled(false);
		
		students.open();
		if(students.size()>0)
		{
			current = students.setCurrentStudent(job.refNum);
			watcher = new WatchHotFolder(this);
			imageLinks = new ArrayList<RefImageLink>();
			chosenLinks = new ArrayList<RefImageLink>();
			loadCurrent();
		}
		allStudents = students.getStudents();
		initializeComboBoxes();
		comboBox_3.setSelectedIndex(0);
		
		status_panel = new JPanel();
		getContentPane().add(status_panel, "cell 2 1,grow");
		checkHotFolder();
		watcher.start();		
	}
	public void setStatus_PanelColor(boolean pair)
	{
		if(pair) status_panel.setBackground(Color.green);
		else status_panel.setBackground(Color.red);
	}
	public void writeLog(String s)
	{
		log.write(s);
	}
	private void checkHotFolder()
	{
		File logFile = new File("TrecsHotFolder\\_log.txt");
		File chosenFile = new File("TrecsHotFolder\\_chosen.txt");
		File[] hotFolderFile = new File("TrecsHotFolder").listFiles();
		if(logFile.exists()&&hotFolderFile.length>0)
		{
			try {
				Scanner lineScanner = new Scanner(logFile);
				String line = "";
				String temp[];
				while(lineScanner.hasNextLine())
				{
					line = lineScanner.nextLine();
					if(line.contains("CaptureJPG"))
					{
						temp = line.split("\t");
						imageLinks.add(new RefImageLink(temp[3],temp[4]));
					}
				}
				lineScanner.close();
			} catch (FileNotFoundException e) {
				writeLog("Error in checkHotFolder: "+e);
			}
		}
		if(chosenFile.exists()&&hotFolderFile.length>0)
		{
			try {
				Scanner lineScanner = new Scanner(chosenFile);
				String line = "";
				String temp[];
				while(lineScanner.hasNextLine())
				{
					line = lineScanner.nextLine();
					if(line.contains("Chosen"))
					{
						temp = line.split("\t");
						updateChosenImageLink(new RefImageLink(temp[3],temp[4]));
					}
				}
				lineScanner.close();
			} catch (FileNotFoundException e) {
				writeLog("Error in checkHotFolder: "+e);
			}
		}
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
		comboBox.removeAllItems();
		comboBox_2.removeAllItems();
		for(String h:homerooms) comboBox.addItem(h);
		for(String t:tracks) comboBox_2.addItem(t);
	}
	private void updateChosenImageLink(RefImageLink link)
	{
		boolean found = false;
		for(int i=0;i<chosenLinks.size();i++)
		{
			if(chosenLinks.get(i).ref.equals(link.ref))
			{
				found = true;
				chosenLinks.get(i).image = link.image;
				break;
			}
		}
		if(!found) chosenLinks.add(link);
	}
	private void initialize()
	{
		upper = new UpcaseFilter();
		setBounds(0, 0, 1350, 1000);
		this.setLocation(0, 0);
		getContentPane().setLayout(new MigLayout("", "[450][450][450]", "[650][350]"));
		this.setVisible(true);
		this.setClosable(true);
		this.setDefaultCloseOperation(DO_NOTHING_ON_CLOSE);
		this.addInternalFrameListener(new InternalFrameListener(){
			public void internalFrameActivated(InternalFrameEvent arg0) {}
			public void internalFrameClosed(InternalFrameEvent arg0) {}
			public void internalFrameClosing(InternalFrameEvent arg0) {close();}
			public void internalFrameDeactivated(InternalFrameEvent arg0) {}
			public void internalFrameDeiconified(InternalFrameEvent arg0) {}
			public void internalFrameIconified(InternalFrameEvent arg0) {}
			public void internalFrameOpened(InternalFrameEvent arg0) {}
		});
		initializePanel();
		initializeImagePanels();
		initializeSearchPanel();
	}
	/*
	 * initializePanel() initializes the student information panel.
	 */
	private void initializePanel()
	{
		panel = new JPanel();
		panel.setBorder(new TitledBorder(null, "Current Student Information", TitledBorder.CENTER, TitledBorder.TOP, null, null));
		getContentPane().add(panel, "cell 0 0,grow");
		panel.setLayout(new MigLayout("", "[225][225]", "[80.00][][][][][][][75.00][][][][][][]"));
		
		lblRef = new JTextArea("Ref #: \r\nLine1\r\nLine2");
		lblRef.setWrapStyleWord(true);
		lblRef.setLineWrap(true);
		lblRef.setEditable(false);
		lblRef.setFont(new Font("Tahoma", Font.BOLD, 24));
		panel.add(lblRef, "cell 0 0 2 1,grow");
		
		textField_1 = new JTextField();
		textField_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		((AbstractDocument) textField_1.getDocument()).setDocumentFilter(upper);
		panel.add(textField_1, "cell 0 1,growx");
		textField_1.setColumns(10);
		
		comboBox = new JComboBox<String>();
		comboBox.setFont(new Font("Tahoma", Font.PLAIN, 16));
		((AbstractDocument) ((JTextField) comboBox.getEditor().getEditorComponent()).getDocument()).setDocumentFilter(upper);
		
		lblLast = new JLabel("Last");
		lblLast.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblLast, "cell 0 2,alignx center");
		panel.add(comboBox, "cell 0 3,growx");
		
		comboBox_1 = new JComboBox<String>();
		comboBox_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		for(String g:GRADES) comboBox_1.addItem(g);
		panel.add(comboBox_1, "flowx,cell 1 3,growx");
		
		lblHomeroom = new JLabel("Homeroom");
		lblHomeroom.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblHomeroom, "cell 0 4,alignx center");
		
		lblGrade = new JLabel("       Grade");
		lblGrade.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblGrade, "cell 1 4,alignx left");
		
		textField_2 = new JTextField();
		textField_2.setFont(new Font("Tahoma", Font.PLAIN, 16));
		((AbstractDocument) textField_2.getDocument()).setDocumentFilter(upper);
		panel.add(textField_2, "cell 0 5,growx");
		textField_2.setColumns(10);
		
		comboBox_2 = new JComboBox<String>();
		((AbstractDocument) ((JTextField) comboBox_2.getEditor().getEditorComponent()).getDocument()).setDocumentFilter(upper);
		panel.add(comboBox_2, "cell 1 5,growx");
		
		lblIdNumber = new JLabel("ID Number");
		lblIdNumber.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblIdNumber, "cell 0 6,alignx center");
		
		lblTrack = new JLabel("Track");
		lblTrack.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblTrack, "cell 1 6,alignx center");
		
		scrollPane = new JScrollPane();
		panel.add(scrollPane, "cell 0 7 2 1,grow");
		
		textPane = new JTextPane();
		textPane.setFont(new Font("Tahoma", Font.PLAIN, 16));
		scrollPane.setViewportView(textPane);
		
		lblNotes = new JLabel("Notes");
		lblNotes.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblNotes, "cell 0 8 2 1,alignx center");
		
		btnEditStudent = new JButton("Edit Student");
		btnEditStudent.setFont(new Font("Tahoma", Font.PLAIN, 16));
		btnEditStudent.addActionListener(this);
		panel.add(btnEditStudent, "cell 0 9,growx");
		
		btnSaveStudent = new JButton("Save Student");
		btnSaveStudent.setFont(new Font("Tahoma", Font.PLAIN, 16));
		btnSaveStudent.addActionListener(this);
		panel.add(btnSaveStudent, "cell 1 9,growx");
		
		chckbxPhotographed = new JCheckBox("Photographed");
		chckbxPhotographed.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(chckbxPhotographed, "cell 1 3");
		
		textField = new JTextField();
		textField.setFont(new Font("Tahoma", Font.PLAIN, 16));
		((AbstractDocument) textField.getDocument()).setDocumentFilter(upper);
		panel.add(textField, "cell 1 1,growx");
		textField.setColumns(10);
		
		lblFirst = new JLabel("First");
		lblFirst.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblFirst, "cell 1 2,alignx center");
		
		chckbxIgnorePhotoLimit = new JCheckBox("Ignore Fall Photo Limit Notification");
		chckbxIgnorePhotoLimit.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(chckbxIgnorePhotoLimit, "cell 0 13 2 1,alignx center");
	}
	private void initializeImagePanels()
	{
		
		current_img_panel = new JPanel();
		current_img_panel.addMouseListener(new MouseListener(){

			@Override
			public void mouseClicked(MouseEvent arg0) {
				chosenFile = "LEFT";
				current_img_panel.setBorder(new TitledBorder(BorderFactory.createMatteBorder(5, 5, 5, 5, Color.red), "Current Student Thumbnail", TitledBorder.CENTER, TitledBorder.TOP, null, null));
				latest_img_panel.setBorder(new TitledBorder(null, "Latest Camera Image", TitledBorder.CENTER, TitledBorder.TOP, null, null));
			}

			@Override
			public void mouseEntered(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mouseExited(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mousePressed(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mouseReleased(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}
			
		});
		current_img_panel.setBorder(new TitledBorder(null, "Current Student Thumbnail", TitledBorder.CENTER, TitledBorder.TOP, null, null));
		getContentPane().add(current_img_panel, "cell 1 0,grow");
		
		latest_img_panel = new JPanel();
		latest_img_panel.addMouseListener(new MouseListener(){

			@Override
			public void mouseClicked(MouseEvent e) {
				chosenFile = "RIGHT";
				current_img_panel.setBorder(new TitledBorder(null, "Current Student Thumbnail", TitledBorder.CENTER, TitledBorder.TOP, null, null));
				latest_img_panel.setBorder(new TitledBorder(BorderFactory.createMatteBorder(5, 5, 5, 5, Color.red), "Latest Camera Image", TitledBorder.CENTER, TitledBorder.TOP, null, null));
			}

			@Override
			public void mouseEntered(MouseEvent e) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mouseExited(MouseEvent e) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mousePressed(MouseEvent e) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mouseReleased(MouseEvent e) {
				// TODO Auto-generated method stub
				
			}
			
		});
		latest_img_panel.setBorder(new TitledBorder(null, "Latest Camera Image", TitledBorder.CENTER, TitledBorder.TOP, null, null));
		getContentPane().add(latest_img_panel, "cell 2 0,grow");
	}
	private void initializeSearchPanel()
	{
		
		//panel_4 = new JPanel();
		//getContentPane().add(panel_4, "cell 3 0,grow");
		searchPanel = new JPanel();
		searchPanel.setBorder(new TitledBorder(null, "Student Search", TitledBorder.CENTER, TitledBorder.TOP, null, null));
		getContentPane().add(searchPanel, "cell 0 1 2 1,grow");
		searchPanel.setLayout(new MigLayout("", "[650][250,grow]", "[30][150,grow]"));
		
		searchPanelBox = new JPanel();
		searchPanel.add(searchPanelBox, "cell 0 0,grow");
		searchPanelBox.setLayout(new MigLayout("", "[50.00][149.00][84.00][150.00]", "[pref!]"));
		
		lblSearch = new JLabel("Search:");
		searchPanelBox.add(lblSearch, "cell 0 0,alignx right");
		
		textField_5 = new JTextField();
		textField_5.setFont(new Font("Tahoma", Font.PLAIN, 16));
		textField_5.addActionListener(this);
		textField_5.getDocument().addDocumentListener(new DocumentListener() {
			  public void changedUpdate(DocumentEvent e) {
				  if(comboBox_3.getSelectedIndex()!=0){
					  search();
					  updateTable(); 
				  }
			  }
			  public void removeUpdate(DocumentEvent e) {
				  if(comboBox_3.getSelectedIndex()!=0){
					  search();
					  updateTable(); 
				  }
			  }
			  public void insertUpdate(DocumentEvent e) {
				  if(comboBox_3.getSelectedIndex()!=0){
					  search();
					  updateTable(); 
				  }
			  }});
		textField_5.setColumns(10);
		((AbstractDocument) textField_5.getDocument()).setDocumentFilter(upper);
		searchPanelBox.add(textField_5, "cell 1 0,growx");
		
		lblCategory = new JLabel("Category:");
		searchPanelBox.add(lblCategory, "cell 2 0,alignx right");
		
		comboBox_3 = new JComboBox<String>();
		comboBox_3.setFont(new Font("Tahoma", Font.PLAIN, 16));
		
		String[] searchChoices = {"Ref Number","Last Name","First Name","ID#","Homeroom","Grade"};
		for(String s:searchChoices) comboBox_3.addItem(s);
		comboBox_3.addActionListener(this);
		searchPanelBox.add(comboBox_3, "cell 3 0,growx");
		
		searchPanelImage = new JPanel();
		searchPanel.add(searchPanelImage, "cell 1 0 1 2,grow");
		
		searchPanelTable = new JPanel();
		searchPanel.add(searchPanelTable, "cell 0 1,grow");
	}
	private void search()
	{
		String value = textField_5.getText();
		if(comboBox_3.getSelectedIndex()==0)
		{
			saveCurrent();
			students.search(value);
			loadCurrent();
			textField_5.selectAll();
			return;
		}
		foundList = new ArrayList<Student>();
		
		searchPanelImage.removeAll();
		
		switch(comboBox_3.getSelectedIndex())
		{
			case 1: 
				for(Student s:allStudents)
					if(s.last.contains(value))
						foundList.add(s);
				break;
			case 2:
				for(Student s:allStudents)
					if(s.first.contains(value))
						foundList.add(s);
				break;
			case 3:
				for(Student s:allStudents)
					if(s.ID.contains(value))
						foundList.add(s);
				break;
			case 4:
				for(Student s:allStudents)
					if(s.homeroom.contains(value))
						foundList.add(s);
				break;
			case 5:
				for(Student s:allStudents)
					if(s.grade.contains(value))
						foundList.add(s);
				break;
			
		}
		updateTableArray();
	}
	private void updateTableArray()
	{
		tempTableArray= new String[foundList.size()][7];
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
	public void updateTable()
	{
		model = new DefaultTableModel(tempTableArray,columnNames){
			@Override
			public boolean isCellEditable(int row, int column){
				return false;
			}
		};
		table = new JTable(model);
		table.getColumnModel().getColumn(0).setPreferredWidth(80);
		table.getColumnModel().getColumn(1).setPreferredWidth(120);
		table.getColumnModel().getColumn(2).setPreferredWidth(120);
		table.getColumnModel().getColumn(3).setPreferredWidth(80);
		table.getColumnModel().getColumn(4).setPreferredWidth(50);
		table.getColumnModel().getColumn(5).setPreferredWidth(100);
		table.setFont(new Font("Tahoma", Font.PLAIN, 16));		table.addMouseListener(new MouseAdapter(){
			public void mousePressed(MouseEvent e){
				updateSearchPicture(tempTableArray[table.getSelectedRow()][0]);
			}
			public void mouseClicked(MouseEvent e)
			{
				if(e.getClickCount()==2)
				{
					saveCurrent();
					students.search(tempTableArray[table.getSelectedRow()][0]);
					loadCurrent();
					if(comboBox_3.getSelectedIndex()==0) textField_5.setText(current.ref);
				}
			}
		});
		table.addKeyListener(new KeyAdapter(){
			public void keyPressed(KeyEvent e)
			{
				if((e.getKeyCode()==KeyEvent.VK_ENTER)&&(table.getSelectedRow()!=-1))
				{
					saveCurrent();
					students.search(tempTableArray[table.getSelectedRow()][0]);
					loadCurrent();
					if(comboBox_3.getSelectedIndex()==0) textField_5.setText(current.ref);
				}
			}
		});
		table.setPreferredScrollableViewportSize(new Dimension(600, 250));
		table.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0), "Enter");

		searchPanelTable.removeAll();
		scrollPane_1 = new JScrollPane(table);
		scrollPane_1.setPreferredSize(new Dimension(600,200));
		searchPanelTable.add(scrollPane_1);
		searchPanelTable.updateUI();
	}
	private void updateSearchPicture(String ref)
	{
		searchPanelImage.removeAll();
		searchFile = new File(schoolPath+"\\CroppedMed\\"+ref+".jpg");
		if(searchFile.exists())
		{
			try 
			{
				tempImage = ImageIO.read(searchFile);
				scaledImage = tempImage.getScaledInstance(-1, 240, Image.SCALE_FAST);
				searchLabel = new JLabel(new ImageIcon(scaledImage));
				searchPanelImage.add(searchLabel);
				scaledImage.flush();
				tempImage.flush();
			} catch (IOException e) {log.write(ref+": Error Displaying Search Picture: "+e);}
		}
		searchPanelImage.updateUI();
	}
	
	private void loadCurrent()
	{
		stuImageCount=0;
		current = students.current;
		lblRef.setText("Ref #: "+current.ref+", C: "+count+"\n"+current.last+", "+current.first);
		textField.setText(current.first);
		textField_1.setText(current.last);
		comboBox.setSelectedItem(current.homeroom);
		comboBox_1.setSelectedItem(current.grade);
		chckbxPhotographed.setSelected(Boolean.parseBoolean(current.photo));
		textField_2.setText(current.ID);
		comboBox_2.setSelectedItem(current.track);
		textPane.setText(current.notes);
		if(current.first.equals("")&&current.last.equals("")) JOptionPane.showMessageDialog(null, "Input student information","Blank Camera Card", JOptionPane.ERROR_MESSAGE);

		current_img_panel.setBorder(new TitledBorder(null, "Current Student Thumbnail", TitledBorder.CENTER, TitledBorder.TOP, null, null));

		chosenFile = "null";
		left = null;

		loadThumbnail();
		if(!incorrect)
		{
			noImgShotYet=true;
			lastImgShot = null;
			lastImageLabel = null;
			latest_img_panel.setBorder(new TitledBorder(null, "Latest Camera Image", TitledBorder.CENTER, TitledBorder.TOP, null, null));
			right = null;
			
			latest_img_panel.removeAll();
			latest_img_panel.updateUI();
		}
		if(incorrect)
		{
			imageLinks.add(new RefImageLink(current.ref,incorrectName));	
			incorrect = false;
			chckbxPhotographed.setSelected(true);
			if(noImgShotYet) count++;
			noImgShotYet = false;
			log.write("CORRECT\t"+current.ref+"\t"+incorrectName);
		}
		
		
		watcher.setCaptureGUI(this);
	}
	private void loadThumbnail()
	{
		current_img_panel.removeAll();
		imageFile = new File(schoolPath+"\\CroppedMed\\"+current.ref+".jpg");

		if(chckbxPhotographed.isSelected())
		{
			for(RefImageLink r:chosenLinks)
			{
				if(r.ref.equals(current.ref))
				{
					noImgShotYet=false;
					try 
					{
						scaledImage = ImageIO.read(new File("TrecsHotFolder\\"+r.image)).getScaledInstance(550, -1, Image.SCALE_FAST);
						tempImage = rotate(imageToBufferedImage(scaledImage));
						imageLabel = new JLabel(new ImageIcon(tempImage));
						current_img_panel.add(imageLabel);
						tempImage.flush();
						scaledImage.flush();
						chosenFile = "LEFT";
						current_img_panel.setBorder(new TitledBorder(BorderFactory.createMatteBorder(5, 5, 5, 5, Color.red), "Current Student Thumbnail", TitledBorder.CENTER, TitledBorder.TOP, null, null));
						latest_img_panel.setBorder(new TitledBorder(null, "Latest Camera Image", TitledBorder.CENTER, TitledBorder.TOP, null, null));
						break;
					}catch (IOException e) {log.write(current.ref+": Error loading Raw Thumbnail: "+e);}
				}
			}
		}
		if(noImgShotYet&&imageFile.exists())
		{
			try 
			{
				tempImage = ImageIO.read(imageFile);
				scaledImage = tempImage.getScaledInstance(420, -1, Image.SCALE_FAST);
				imageLabel = new JLabel(new ImageIcon(scaledImage));
				current_img_panel.add(imageLabel);
				tempImage.flush();
				scaledImage.flush();
			}catch (IOException e) {log.write(current.ref+": Error loading Thumbnail: "+e);}
		}
		current_img_panel.updateUI();
	}
	private void setPanelEnabled(boolean edit)
	{
		textField.setEnabled(edit);
		textField_1.setEnabled(edit);
		textField_2.setEnabled(edit);
		comboBox.setEnabled(edit);
		comboBox_1.setEnabled(edit);
		comboBox_2.setEnabled(edit);
		chckbxPhotographed.setEnabled(edit);
		textPane.setEnabled(edit);
		btnEditStudent.setVisible(!edit);
		btnSaveStudent.setVisible(edit);
	}
	private void saveCurrent()
	{
		boolean needToSave = false;
		boolean updateComboBoxes = false;
		String changes = current.ref+": Saved changes:\t";
		if(!current.first.equals(textField.getText().trim())){changes+="First: "+current.first+":"+textField.getText().trim()+"\t";current.first = textField.getText().trim();needToSave = true;}
		if(!current.last.equals(textField_1.getText().trim())){changes+="Last: "+current.last+":"+textField_1.getText().trim()+"\t";current.last = textField_1.getText().trim();needToSave = true;}
		if(!current.homeroom.equals(comboBox.getSelectedItem()))
		{
			changes+="Homeroom: "+current.homeroom+":"+(String)comboBox.getSelectedItem()+"\t";
			current.homeroom = (String)comboBox.getSelectedItem();needToSave = true;
			updateComboBoxes = true;
		}
		if(!current.grade.equals(comboBox_1.getSelectedItem())){changes+="Grade: "+current.grade+":"+(String)comboBox_1.getSelectedItem()+"\t";current.grade = (String)comboBox_1.getSelectedItem();needToSave = true;}
		if(!current.photo.equals(chckbxPhotographed.isSelected()+"")){changes+="Photo: "+current.photo+":"+chckbxPhotographed.isSelected()+"\t";current.photo = chckbxPhotographed.isSelected()+"";needToSave = true;}
		if(!current.ID.equals(textField_2.getText().trim())){changes+="ID: "+current.ID+":"+textField_2.getText().trim()+"\t";current.ID = textField_2.getText().trim();needToSave = true;}
		if(!current.track.equals(comboBox_2.getSelectedItem()))
		{
			changes+="Homeroom: "+current.track+":"+(String)comboBox_2.getSelectedItem()+"\t";
			current.track = (String)comboBox_2.getSelectedItem();needToSave = true;
			updateComboBoxes = true;
		}
		if(!current.notes.equals(textPane.getText().trim())){changes+="Notes: "+current.notes+":"+textPane.getText().trim()+"\t";current.notes = textPane.getText().trim();needToSave = true;}

		setPanelEnabled(false);
		if(chosenFile.equals("LEFT")&&left!=null)
		{
			updateChosenImageLink(new RefImageLink(current.ref, left.getName()));
			log.writeChosenLog(current.ref+"\t"+left.getName());
		}
		else if(chosenFile.equals("RIGHT")&&right!=null)
		{
			if(incorrect) JOptionPane.showMessageDialog(null, "You just said this wasn't the correct image for this reference number... You're causing problems.");
				updateChosenImageLink(new RefImageLink(current.ref, right.getName()));
				log.writeChosenLog(current.ref+"\t"+right.getName());
		}
		else if(!noImgShotYet&&chosenFile.equals("null"))
		{
			if(!incorrect)
			{
				JOptionPane.showMessageDialog(null, "You did not select an image.  Most Recent Image will be chosen.");
				updateChosenImageLink(new RefImageLink(current.ref, right.getName()));
				log.writeChosenLog(current.ref+"\t"+right.getName());
			}
			else
			{
				JOptionPane.showMessageDialog(null, "You did not select an image.  But last image shot was incorrect, so your left image will be chosen.");
				updateChosenImageLink(new RefImageLink(current.ref, left.getName()));
				log.writeChosenLog(current.ref+"\t"+left.getName());
			}
		}
		if(needToSave)
		{
			log.write(changes);
			students.saveStudent(current);
			students.setCurrentStudent(current.ref);
			allStudents = students.getStudents();
			if(updateComboBoxes)
			{
				initializeComboBoxes();
				comboBox.setSelectedItem(current.homeroom);
				comboBox_2.setSelectedItem(current.track);
			}
			
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
			}
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
	private void loadLastLabel(JLabel label, File image)
	{
		if(label!=null)
		{
			if(image.exists()) left = image;
			current_img_panel.removeAll();
			current_img_panel.add(label);
			current_img_panel.updateUI();
		}
	}

	
	  public static BufferedImage imageToBufferedImage(Image im) {
		     BufferedImage bi = new BufferedImage
		        (im.getWidth(null),im.getHeight(null),BufferedImage.TYPE_INT_RGB);
		     Graphics bg = bi.getGraphics();
		     bg.drawImage(im, 0, 0, null);
		     bg.dispose();
		     return bi;
		  }
	/**
	 * Function waits a second to make sure jpg is fully transfered over.  
	 * It then scales the image down, rotates it, and casts it to an image icon.
	 * @param image
	 * @throws Exception
	 */
	public void processCapturedImage(File image) throws Exception
	{
		scaledImage= ImageIO.read(image).getScaledInstance(550, -1, Image.SCALE_FAST);
		tempImage = rotate(imageToBufferedImage(scaledImage));
		capturedLabel = new JLabel(new ImageIcon(tempImage));
		currentCaptureLabel = capturedLabel;
		latest_img_panel.add(capturedLabel);
		latest_img_panel.updateUI();
		scaledImage.flush();
		tempImage.flush();
	}
	public void updateCapturedImage(File image)
	{

		
		chckbxPhotographed.setSelected(true);
		if(noImgShotYet) count++;
		noImgShotYet = false;
		latest_img_panel.removeAll();
		if(image.exists())
		{
			right = image;
			try
			{
				processCapturedImage(image);				
			}catch(Exception e) 
			{
				log.write("Display1 Fail "+count+": "+current.ref+" "+image.getName()+" "+e.getLocalizedMessage());
				try
				{
					processCapturedImage(image);
				}catch(Exception e1)
				{
					log.write("Display2 Fail "+count+": "+current.ref+" "+image.getName()+" "+e.getLocalizedMessage());
					try
					{
						processCapturedImage(image);
					}catch(Exception e2)
					{
						log.write(current.ref+image.getName()+": DID NOT DISPLAY!. "+e2.getMessage());
						JOptionPane.showMessageDialog(null, "Error Displaying Captured Image.  Don't freek out, it is saved.  Keep shooting.");
					}
				}
			}
		}
		else
		{
			try{
				Thread.sleep(1000);
				if(image.exists())
				{
					processCapturedImage(image);
					log.write(count+": "+current.ref+image.getName()+": Successfully Displayed4.");
				}
				else
				{
					log.write(current.ref+": Image Does not Exist: "+image.getName());
					JOptionPane.showMessageDialog(null, image.getName() + " File in RAW folder does not exist so it will not show up... \n"
							+ "Make sure NO other instances of TRECS are running and that the images aren't becing copied to a different TRECS student.\n"
							+ "You may have to restart the computer to fix the issue." );
				}
			}catch(Exception e){
				log.write(current.ref+": DID NOT DISPLAY! Error4. "+e.getMessage());
				JOptionPane.showMessageDialog(null, "Error Displaying Captured Image.  Don't freek out, it is saved.  Keep shooting.");
			}

		}
		lblRef.setText("Ref #: "+current.ref+", C: "+count+"\n"+current.last+", "+current.first);
		latest_img_panel.updateUI();
		if(chosenFile.equals("RIGHT"))
		{
			loadLastLabel(lastImageLabel, lastImgShot);
			//loadLastImage(lastImgShot);
			chosenFile = "LEFT";
			current_img_panel.setBorder(new TitledBorder(BorderFactory.createMatteBorder(5, 5, 5, 5, Color.red), "Current Student Thumbnail", TitledBorder.CENTER, TitledBorder.TOP, null, null));
			latest_img_panel.setBorder(new TitledBorder(null, "Latest Camera Image", TitledBorder.CENTER, TitledBorder.TOP, null, null));
		}
		else if(chosenFile.equals("null"))
		{
			loadLastLabel(lastImageLabel, lastImgShot);
			//loadLastImage(lastImgShot);
		}
		lastImgShot = image;
		lastImageLabel = currentCaptureLabel;
		
		stuImageCount++;
		if(!chckbxIgnorePhotoLimit.isSelected())
		{
			int confirm = JOptionPane.YES_OPTION;
			if(stuImageCount>2) confirm = JOptionPane.showConfirmDialog(null, "You have taken "+stuImageCount+" pictures under the same reference number.\n"
					+ "Are you still photographing "+current.first+" "+current.last+"?");
			if(confirm==JOptionPane.NO_OPTION)
			{
				log.write("INCORRECT\t"+current.ref+"\t"+image.getName());
				JOptionPane.showMessageDialog(null, "The latest image you just shot will be linked under the next reference you select.");
				incorrect = true;
				incorrectName = image.getName();
			}
			else imageLinks.add(new RefImageLink(current.ref,image.getName()));
		}
	}

	public void close()
	{
		saveCurrent();
		students.close();
		window.add(new StudentGUI(window, job, schoolData, students));
		watcher.stopRunning();
		log.write("------Stop Watch------");
		this.dispose();
	}
	
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		if(pressed==btnEditStudent)
		{
			setPanelEnabled(true);
			textField_1.requestFocusInWindow();
		}
		else if(pressed==btnSaveStudent)
		{
			saveCurrent();
			textField_5.requestFocusInWindow();
			textField_5.selectAll();
		}
		else if(pressed==comboBox_3)
		{
			if(comboBox_3.getSelectedIndex()==0)
			{
				textField_5.selectAll();
				foundList = new ArrayList<Student>();
				foundList.addAll(allStudents);
				updateTableArray();
				updateTable();
			}
		}
		else if(pressed==textField_5)
		{
			search();
		}
	}
    public BufferedImage rotate(BufferedImage image) {

        double sin = Math.abs(Math.sin(Math.toRadians(90))), cos = Math.abs(Math.cos(Math.toRadians(90)));
        int w = image.getWidth(), h = image.getHeight();
        int neww = (int)Math.floor(w*cos+h*sin), newh = (int)Math.floor(h*cos+w*sin);
        GraphicsConfiguration gc = getDefaultConfiguration();
        BufferedImage result = gc.createCompatibleImage(neww, newh, Transparency.TRANSLUCENT);
        gResult = result.createGraphics();
        gResult.translate((neww-w)/2, (newh-h)/2);
        gResult.rotate((Math.toRadians(-90)), w/2, h/2);
        gResult.drawRenderedImage(image, null);
        gResult.dispose();
        return result;
    }
    public static GraphicsConfiguration getDefaultConfiguration() {
        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        GraphicsDevice gd = ge.getDefaultScreenDevice();
        return gd.getDefaultConfiguration();
    }
}
class UpcaseFilter extends DocumentFilter{
	  public void insertString(DocumentFilter.FilterBypass fb, int offset,
		      String text, AttributeSet attr) throws BadLocationException {
		    fb.insertString(offset, text.toUpperCase(), attr);
		  }
		  public void replace(DocumentFilter.FilterBypass fb, int offset, int length,
		      String text, AttributeSet attr) throws BadLocationException {
		    fb.replace(offset, length, text.toUpperCase(), attr);
		  }
}
class RefImageLink
{
	public String ref, image;
	public RefImageLink(String ref, String image)
	{
		this.ref = ref;
		this.image = image;
	}
}
