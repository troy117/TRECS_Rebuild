package photo.software.composites;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JTextField;
import javax.swing.JCheckBox;


import photo.software.comparators.StudentClassSortComparator;
import photo.software.login.SchoolData;
import photo.software.student.Student;
import photo.software.student.StudentGUI;

import javax.swing.JProgressBar;

@SuppressWarnings("serial")
public class CompositeGUI extends JInternalFrame implements ActionListener{
	private JTextField textField;
	private JTextField textField_1;
	private JTextField textField_2;
	private JTextField textField_3;
	@SuppressWarnings("rawtypes")
	private JComboBox comboBox, comboBox_1, comboBox_2, comboBox_3, comboBox_4;
	private ArrayList<Student> students, teachers;
	private ArrayList<String> teachersNames, listNames, homerooms;
	private JButton btnRefreshStudentData, btnRun,btnOutput;
	private JCheckBox chckbxOnlyPhotographedStudents, chckbxIncludeSchoolText;
	StudentGUI stuGUI;
	private JButton btnBuildCompositeCount;
	private int cCount = 0, labelCount = 0;
	private JButton btnBuildIndividualComposite,btnRunManual;
	private JLabel lblManualBuild;
	private JLabel lblHorizontalSize;
	private JLabel lblHorizontalGap;
	private JLabel lblVerticalGap;
	private JLabel lblColumns;
	private JLabel lblName;
	private JTextField textField_4;
	private JTextField textField_5;
	private JTextField textField_6;
	private JTextField textField_7;
	private JTextField txtGrade;
	private BufferedImage envelope = null, label = null;
	private int fontSize,width;
	private FontMetrics fm;
	private String momDad="";
	private SchoolData data;
	private JProgressBar progressBar;
	private JButton btnCancel;
	private Thread compositeThread = null;
	private JLabel lblPrincipalLine;
	private JTextField textField_8;
	
	
	private BufferedImage compositeImage;
	private String compositeHR="";
	
	
	public CompositeGUI(StudentGUI stuGUI, SchoolData data) 
	{
		this.stuGUI = stuGUI;
		this.data = data;
		
		students = new ArrayList<Student>();
		
		initialize();
		loadStudentData();
	}
	
	@SuppressWarnings("unchecked")
	private void loadStudentData()
	{
		students = stuGUI.getStudents().getStudents();
		listNames = stuGUI.getStudents().getListNames();
		
		homerooms = new ArrayList<String>();
		homerooms.add("");
		for(Student s:students)
		{
			if(!homerooms.contains(s.homeroom)) homerooms.add(s.homeroom);
		}
		Collections.sort(homerooms);
		
		teachers = new ArrayList<Student>();
		teachersNames = new ArrayList<String>();
		teachersNames.add("");
		for(Student s:students)
		{
			if(s.grade.equals("FAC")&&(!s.first.equals(""))&&(!s.last.equals("")))
			{
				teachersNames.add(s.last+", "+s.first);
				teachers.add(s);
			}
		}
		Collections.sort(teachersNames);
		comboBox.removeAllItems();
		comboBox_1.removeAllItems();
		comboBox_2.removeAllItems();
		for(String t:teachersNames)
		{
			comboBox.addItem(t);
			comboBox_1.addItem(t);
			comboBox_2.addItem(t);
		}
		comboBoxPressed();
	}
	
	private void initialize()
	{
		this.setVisible(true);
		this.setClosable(true);
		setBounds(100, 100, 796, 683);
		getContentPane().setLayout(new MigLayout("", "[350.00][350.00]", "[300.00][300.00]"));
		
		initializeDataPanel();
		initializeCompostiePanel();

		
		JPanel panel_2 = new JPanel();
		getContentPane().add(panel_2, "cell 0 1,grow");
		panel_2.setLayout(new MigLayout("", "[][][71.00][137.00,grow]", "[][][][][][][]"));
		
		lblManualBuild = new JLabel("Manual Build");
		lblManualBuild.setFont(new Font("Tahoma", Font.BOLD, 18));
		panel_2.add(lblManualBuild, "cell 0 0 4 1,alignx center");
		
		lblHorizontalSize = new JLabel("Horizontal Size:");
		panel_2.add(lblHorizontalSize, "cell 1 1");
		
		textField_4 = new JTextField();
		textField_4.setText("140");
		panel_2.add(textField_4, "cell 2 1,growx");
		textField_4.setColumns(10);
		
		lblHorizontalGap = new JLabel("Horizontal Gap:");
		panel_2.add(lblHorizontalGap, "cell 1 2,alignx trailing");
		
		textField_5 = new JTextField();
		textField_5.setText("25");
		panel_2.add(textField_5, "cell 2 2,growx");
		textField_5.setColumns(10);
		
		lblVerticalGap = new JLabel("Vertical Gap:");
		panel_2.add(lblVerticalGap, "cell 1 3,alignx trailing");
		
		textField_6 = new JTextField();
		textField_6.setText("55");
		panel_2.add(textField_6, "cell 2 3,growx");
		textField_6.setColumns(10);
		
		lblColumns = new JLabel("Columns:");
		panel_2.add(lblColumns, "cell 1 4,alignx trailing");
		
		textField_7 = new JTextField();
		textField_7.setText("12");
		panel_2.add(textField_7, "cell 2 4,growx");
		textField_7.setColumns(10);
		
		lblName = new JLabel("Name:");
		panel_2.add(lblName, "cell 1 5,alignx trailing");
		
		txtGrade = new JTextField();
		txtGrade.setText("Grade");
		panel_2.add(txtGrade, "cell 2 5,growx");
		txtGrade.setColumns(10);
		
		btnRunManual = new JButton("Run");
		btnRunManual.addActionListener(this);
		panel_2.add(btnRunManual, "cell 2 6,growx");
		
		
		JPanel panel_3 = new JPanel();
		getContentPane().add(panel_3, "cell 1 1,grow");
		panel_3.setLayout(new MigLayout("", "[][]", "[][][]"));
		
		btnBuildCompositeCount = new JButton("Build Composite Count");
		btnBuildCompositeCount.addActionListener(this);
		panel_3.add(btnBuildCompositeCount, "cell 1 1");
		
		btnBuildIndividualComposite = new JButton("Build Individual Composite");
		btnBuildIndividualComposite.addActionListener(this);
		panel_3.add(btnBuildIndividualComposite, "cell 1 2");
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void initializeDataPanel()
	{
		JPanel panel = new JPanel();
		getContentPane().add(panel, "cell 0 0,grow");
		panel.setLayout(new MigLayout("", "[][285.00]", "[][][][][][][][][][]"));
		
		JLabel lblStudents = new JLabel("Students");
		panel.add(lblStudents, "cell 0 0,alignx trailing");
		
		String[] studentChoice = {"All Students","Grade","Homeroom","List"};
		comboBox_3 = new JComboBox(studentChoice);
		comboBox_3.addActionListener(this);
		panel.add(comboBox_3, "cell 1 0,growx");
		
		comboBox_4 = new JComboBox();
		comboBox_4.setVisible(false);
		panel.add(comboBox_4, "cell 1 1,growx");
		
		JLabel lblAddToAll = new JLabel("Add to All Composites:");
		panel.add(lblAddToAll, "cell 0 4 2 1,alignx center");
		
		JLabel lblRight = new JLabel("Right");
		panel.add(lblRight, "cell 0 5,alignx trailing");
		
		comboBox = new JComboBox();
		panel.add(comboBox, "cell 1 5,growx");
		
		JLabel lblTo = new JLabel("to");
		panel.add(lblTo, "cell 0 6,alignx trailing");
		
		comboBox_1 = new JComboBox();
		panel.add(comboBox_1, "cell 1 6,growx");
		
		JLabel lblLeft = new JLabel("Left");
		panel.add(lblLeft, "cell 0 7,alignx trailing");
		
		comboBox_2 = new JComboBox();
		panel.add(comboBox_2, "cell 1 7,growx");
		
		btnRefreshStudentData = new JButton("Refresh Student Data");
		btnRefreshStudentData.addActionListener(this);
		panel.add(btnRefreshStudentData, "cell 0 9 2 1,growx");
	}
	private void initializeCompostiePanel()
	{
		JPanel panel_1 = new JPanel();
		getContentPane().add(panel_1, "cell 1 0,grow");
		panel_1.setLayout(new MigLayout("", "[][257.00,grow]", "[][][][][][][][][][]"));
		
		JLabel lblSchoolName = new JLabel("School Name:");
		panel_1.add(lblSchoolName, "cell 0 0,alignx trailing");
		
		textField = new JTextField(data.schoolName);
		panel_1.add(textField, "cell 1 0,growx");
		textField.setColumns(10);
		
		btnOutput = new JButton("Output");
		btnOutput.addActionListener(this);
		
		lblPrincipalLine = new JLabel("Principal Line:");
		panel_1.add(lblPrincipalLine, "cell 0 1,alignx trailing");
		
		textField_8 = new JTextField();
		panel_1.add(textField_8, "cell 1 1,growx");
		textField_8.setColumns(10);
		
		JLabel lblSchoolYear = new JLabel("School Year:");
		panel_1.add(lblSchoolYear, "cell 0 2,alignx trailing");
		
		textField_1 = new JTextField();
		textField_1.setText("2025-2026");
		panel_1.add(textField_1, "flowx,cell 1 2,growx");
		textField_1.setColumns(10);
		panel_1.add(btnOutput, "cell 0 4");
		
		textField_3 = new JTextField();
		panel_1.add(textField_3, "cell 1 4,growx");
		textField_3.setColumns(10);
		
		chckbxOnlyPhotographedStudents = new JCheckBox("Only Photographed Students");
		panel_1.add(chckbxOnlyPhotographedStudents, "cell 1 5");
		
		chckbxIncludeSchoolText = new JCheckBox("Include School Text");
		chckbxIncludeSchoolText.setSelected(true);
		panel_1.add(chckbxIncludeSchoolText, "cell 1 6");
		
		btnRun = new JButton("Run");
		btnRun.addActionListener(this);
		panel_1.add(btnRun, "cell 0 8,growx");
		
		progressBar = new JProgressBar(0,100);
		panel_1.add(progressBar, "cell 1 8,grow");
		
		btnCancel = new JButton("Cancel");
		btnCancel.setEnabled(false);
		panel_1.add(btnCancel, "cell 1 9,growx");
		
		JLabel lblTextmaxx = new JLabel("TextMaxX:");
		panel_1.add(lblTextmaxx, "cell 1 2");
		
		textField_2 = new JTextField();
		textField_2.setText("1350");
		panel_1.add(textField_2, "cell 1 2");
		textField_2.setColumns(10);
	}
	public void updateProgressBar(int current)
	{
		progressBar.setValue(current);
	}
	
	@SuppressWarnings("unchecked")
	private void comboBoxPressed()
	{
		if(comboBox_3.getSelectedIndex()==0)
		{
			comboBox_4.removeAllItems();
			comboBox_4.setVisible(false);
		}
		//Grade
		else if(comboBox_3.getSelectedIndex()==1)
		{
			comboBox_4.removeAllItems();
			String[] gradesList = {"","PRE","TK","KIN","01","02","03","04","05",
					"06","07","08","09","10","11","12","13","14","15","FAC","EXMPT"};
			for(String s:gradesList) comboBox_4.addItem(s);
			comboBox_4.setVisible(true);
		}
		//Homeroom
		else if(comboBox_3.getSelectedIndex()==2)
		{
			comboBox_4.removeAllItems();
			for(String h: homerooms) comboBox_4.addItem(h);
			comboBox_4.setVisible(true);
		}
		//List
		else if(comboBox_3.getSelectedIndex()==3)
		{
			comboBox_4.removeAllItems();
			comboBox_4.addItem("");
			for(String l:listNames) comboBox_4.addItem(l);
			comboBox_4.setVisible(true);
		}
	}

	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		if(pressed==comboBox_3)
		{
			comboBoxPressed();
		}
		else if(pressed==btnRefreshStudentData)
		{
			loadStudentData();
		}
		else if(pressed==btnRunManual)
		{
			ArrayList<Student> mList = new ArrayList<Student>();
			if(comboBox_3.getSelectedIndex()==1)
			{
				for(Student s:students)
				{
					if(s.grade.equals(comboBox_4.getSelectedItem())&&(s.photo.equals("true"))) mList.add(s);
				}
				new ManualCompositeBuilder(mList,textField_4.getText(),textField_5.getText(),textField_6.getText(),
						textField_7.getText(),stuGUI.schoolPath,txtGrade.getText());
			}
			else JOptionPane.showMessageDialog(null, "Feature only works with selected grade");
			
		}
		else if(pressed==btnOutput)
		{
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int returnVal = fc.showOpenDialog(null);
			if(returnVal==JFileChooser.APPROVE_OPTION)	textField_3.setText(fc.getSelectedFile().getAbsolutePath());
		}
		else if(pressed==btnRun)
		{
			ArrayList<Student> staffAdd = new ArrayList<Student>();
			Boolean b = false, duplicate =false;
			
			if(comboBox.getSelectedIndex()!=0)
			{
				for(Student t:teachers)
				{
					if((t.last+", "+t.first).equals(comboBox.getSelectedItem())) 
					{
						if(b) JOptionPane.showMessageDialog(null, "Duplicate staff member with name: "+t.first+" "+t.last);
						staffAdd.add(t);
						b=true;
					}
				}
				b=false;
			}
			if(comboBox_1.getSelectedIndex()!=0)
			{
				for(Student t:teachers)
				{
					if((t.last+", "+t.first).equals(comboBox_1.getSelectedItem()))
					{
						if(b) JOptionPane.showMessageDialog(null, "Duplicate staff member with name: "+t.first+" "+t.last);
						staffAdd.add(t);
						b=true;
					}
				}
				b=false;
			}
			if(comboBox_2.getSelectedIndex()!=0)
			{
				for(Student t:teachers)
				{
					if((t.last+", "+t.first).equals(comboBox_2.getSelectedItem()))
					{
						if(b) JOptionPane.showMessageDialog(null, "Duplicate staff member with name: "+t.first+" "+t.last);
						staffAdd.add(t);
						b=true;
					}
				}
				b=false;
			}
			if(!duplicate)
			{
				CompositeCreator composites = new CompositeCreator(this,students,staffAdd,stuGUI.schoolPath,textField_3.getText(),
						chckbxIncludeSchoolText.isSelected(),chckbxOnlyPhotographedStudents.isSelected(),
						textField.getText(),textField_8.getText(),textField_1.getText(),textField_2.getText());
				if(comboBox_3.getSelectedIndex()==2&&comboBox_4.getSelectedIndex()!=0)
				{
					composites.build((String)comboBox_4.getSelectedItem());
				}
				else
				{
					btnRun.setEnabled(false);
					btnCancel.setEnabled(true);
					compositeThread = new Thread(composites);
					compositeThread.run();
				}
			}
		}
		else if(pressed==btnCancel)
		{
			compositeThread.interrupt();
			compositeThread = null;
			btnCancel.setEnabled(false);
			btnRun.setEnabled(true);
		}
		else if(pressed==btnBuildIndividualComposite)
		{
			String[] temp;
			int sComp, tComp;
			cCount = 0;
			(new File(textField_3.getText()+"\\StudentComposites")).mkdir();
			(new File(textField_3.getText()+"\\Staff")).mkdir();
			(new File(textField_3.getText()+"\\Envelopes")).mkdir();
			(new File(textField_3.getText()+"\\Labels")).mkdir();
			try
			{
				envelope = ImageIO.read(new File("Templates\\PortraitEnvelope.jpg"));
				label = ImageIO.read(new File("Templates\\CompositeLabel.jpg"));
			}catch(IOException e){JOptionPane.showMessageDialog(null, "Unable to open Envelope Background: "+e);}
			ArrayList<Student> classStudents = new ArrayList<Student>();
			ArrayList<Student> starStudents = new ArrayList<Student>();
			Student s = stuGUI.current;
			if(s.order1Pay.equals("true"))
			{
				sComp = 0;
				tComp = 0;
				temp = s.order1.split("\\.");
				for(String t:temp)
				{
					if(t.equals("1")||t.equals("2")||t.equals("3")||t.equals("4")||t.equals("11")||t.equals("12")||t.equals("28"))
					{
						starStudents.add(s);
						sComp++;
					}
					else if(t.equals("5")||t.equals("6")||t.equals("7")||t.equals("8")
							||t.equals("9")||t.equals("101")||t.equals("27"))
					{
						classStudents.add(s);
						tComp++;
					}
				}
				if(s.order1.contains("93")) momDad = "Dad's ";
				else if(s.order1.contains("92")) momDad = "Mom's ";
				else momDad="";
				if(sComp>0||tComp>0){ 
					envelopes(s,sComp,tComp,momDad+"Order1"); 
					labels(s,sComp,tComp,momDad+"Order1");
				}
			}
			if(s.order2Pay.equals("true"))
			{
				sComp = 0;
				tComp = 0;
				temp = s.order2.split("\\.");
				for(String t:temp)
				{
					if(t.equals("1")||t.equals("2")||t.equals("3")||t.equals("4")||t.equals("11")||t.equals("12")||t.equals("28"))
					{
							starStudents.add(s);
							sComp++;
					}
					else if(t.equals("5")||t.equals("6")||t.equals("7")||t.equals("8")
							||t.equals("9")||t.equals("101")||t.equals("27"))
					{
						classStudents.add(s);
						tComp++;
					}
				}
				if(s.order1.contains("93")) momDad = "Dad's ";
				else if(s.order1.contains("92")) momDad = "Mom's ";
				else momDad="";
				if(sComp>0||tComp>0)
				{
					envelopes(s,sComp,tComp,momDad+"Order2");
					labels(s,sComp,tComp,momDad+"Order2");
				}
			}
			envelope.flush();
			envelope = null;
			label.flush();
			label = null;
			for(Student c:classStudents) traditionalComposite(c,true);
			CompositeCreator composites = new CompositeCreator(this,students,new ArrayList<Student>(),stuGUI.schoolPath,textField_3.getText(),
					chckbxIncludeSchoolText.isSelected(),chckbxOnlyPhotographedStudents.isSelected(),
					textField.getText(),textField_8.getText(),textField_1.getText(),textField_2.getText());
			composites.buildStarStudent(starStudents);
		}
		else if(pressed==btnBuildCompositeCount)
		{
			String[] temp;
			int sComp, tComp;
			cCount = 0;
			(new File(textField_3.getText()+"\\StudentComposites")).mkdir();
			(new File(textField_3.getText()+"\\Staff")).mkdir();
			(new File(textField_3.getText()+"\\Envelopes")).mkdir();
			(new File(textField_3.getText()+"\\Labels")).mkdir();
			try
			{
				envelope = ImageIO.read(new File("Templates\\PortraitEnvelope.jpg"));
				label = ImageIO.read(new File("Templates\\CompositeLabel.jpg"));
			}catch(IOException e){JOptionPane.showMessageDialog(null, "Unable to open Envelope Background: "+e);}
			
			ArrayList<Student> classStudents = new ArrayList<Student>();
			ArrayList<Student> starStudents = new ArrayList<Student>();
			ArrayList<Student> teacherComposites = new ArrayList<Student>();
			for(Student s:students)
			{
				if(s.grade.equals("FAC")&&(!s.homeroom.equals(""))) teacherComposites.add(s);
				if(s.order1Pay.equals("true"))
				{
					sComp = 0;
					tComp = 0;
					temp = s.order1.split("\\.");
					for(String t:temp)
					{
						if(t.equals("1")||t.equals("2")||t.equals("3")||t.equals("4")||t.equals("11")||t.equals("12")||t.equals("28"))
						{
							starStudents.add(s);
							sComp++;
						}
						else if(t.equals("5")||t.equals("6")||t.equals("7")||t.equals("8")
								||t.equals("9")||t.equals("101")||t.equals("27"))
						{
							classStudents.add(s);
							tComp++;
						}
					}
					if(s.order1.contains("93")) momDad = "Dad's ";
					else if(s.order1.contains("92")) momDad = "Mom's ";
					else momDad="";
					if(sComp>0||tComp>0)
					{
						envelopes(s,sComp,tComp,momDad);
						labels(s,sComp,tComp,momDad);
					}
				}
				if(s.order2Pay.equals("true"))
				{
					sComp = 0;
					tComp = 0;
					temp = s.order2.split("\\.");
					for(String t:temp)
					{
						if(t.equals("1")||t.equals("2")||t.equals("3")||t.equals("4")||t.equals("11")||t.equals("12")||t.equals("28"))
						{
							starStudents.add(s);
							sComp++;
						}
						else if(t.equals("5")||t.equals("6")||t.equals("7")||t.equals("8")
								||t.equals("9")||t.equals("101")||t.equals("27"))
						{
							classStudents.add(s);
							tComp++;
						}
					}
					if(s.order1.contains("93")) momDad = "Dad's ";
					else if(s.order1.contains("92")) momDad = "Mom's ";
					else momDad="";
					if(sComp>0||tComp>0)
					{
						envelopes(s,sComp,tComp,momDad);
						labels(s,sComp,tComp,momDad);
					}
				}
			}
			envelope.flush();
			envelope = null;
			label.flush();
			label = null;
			Collections.sort(classStudents, new StudentClassSortComparator());

			
			for(Student s:classStudents) traditionalComposite(s,true);
			for(Student s:teacherComposites) traditionalComposite(s,false);
			compositeImage.flush();
			compositeImage = null;
			
			CompositeCreator composites = new CompositeCreator(this,students,new ArrayList<Student>(),stuGUI.schoolPath,textField_3.getText(),
					chckbxIncludeSchoolText.isSelected(),chckbxOnlyPhotographedStudents.isSelected(),
					textField.getText(),textField_8.getText(),textField_1.getText(),textField_2.getText());
			composites.buildStarStudent(starStudents);
			//stackCut(2,new File(textField_3.getText()+"\\StudentComposites"));
			createCover();
			
		}
		
	}
	/*
	 * Use with old version where composites were stack cut.
	 
	private void stackCut(int divisions, File folder)
	{
		File[] images = folder.listFiles(new FilenameFilter(){
			public boolean accept(File dir, String name){
				return name.toUpperCase().endsWith(".JPG");
			}
		});
		ArrayList<File> imageList = new ArrayList<File>();
		for(File f:images) imageList.add(f);
		Collections.sort(imageList);
		
		int pages = (imageList.size()+(divisions-1))/divisions;
		int index=0;
		int prefix=0;
		for(int i=0;i<divisions;i++)
		{
			for(int j=0;j<pages;j++)
			{
				prefix = (j*divisions)+i;
				if(index<imageList.size())
				{
					imageList.get(index).renameTo(new File(folder.getAbsolutePath()+"\\"+String.format("%05d", prefix)+"_"+imageList.get(index).getName()));
				}
				index++;
			}
		}
	}
	*/
	private void createCover()
	{
		try 
		{
			BufferedImage bImage = ImageIO.read(new File("Templates\\composite cover.jpg"));
			Graphics2D g = bImage.createGraphics();
			g.setColor(Color.black);
			
			fontSize = 200;
			g.setFont(new Font("goingtodogreatthings", Font.PLAIN, fontSize));
			fm = g.getFontMetrics();
			width = fm.stringWidth(textField.getText());
			while(width>2700)
			{
				fontSize--;
				g.setFont(new Font("goingtodogreatthings", Font.PLAIN, fontSize));
				fm = g.getFontMetrics();
				width = fm.stringWidth(textField.getText());
			}
			g.drawString(textField.getText(), 1650-(width/2), 1140);
			ImageIO.write(bImage, "jpg", new File(textField_3.getText()+"\\__Cover.jpg"));
			bImage.flush();
			bImage = null;
			
		} catch (IOException e) {
			JOptionPane.showMessageDialog(null, "Error: "+e);
		}
		
	}
	private void envelopes(Student s, int sComp, int tComp, String order)
	{
		try
		{
			labelCount++;
			BufferedImage bImage = new BufferedImage(2625,3975,BufferedImage.TYPE_INT_RGB);
			Image stuImg;
			Graphics2D g = bImage.createGraphics();
			g.setColor(Color.white);
			g.fillRect(0,0,2625,3975);
			if(envelope!=null) g.drawImage(envelope, 0, 0, null);
			
			File stuMed = new File(stuGUI.schoolPath+"\\CroppedMed\\"+s.ref+".jpg");
			if(stuMed.exists())
			{
				stuImg = ImageIO.read(stuMed).getScaledInstance(-1, 750, Image.SCALE_SMOOTH);
				g.drawImage(stuImg,100,740,null);
				stuImg.flush();
				stuImg = null;
			}
			g.setColor(Color.black);
			///////First and Last Name///////
			fontSize = 140;
			g.setFont(new Font("Arial",Font.PLAIN,fontSize));
			fm = g.getFontMetrics();
			width = fm.stringWidth(s.first+" "+s.last);
			
			while(width>1500)
			{
				fontSize--;
				g.setFont(new Font("Arial",Font.PLAIN,fontSize));
				fm = g.getFontMetrics();
				width = fm.stringWidth(s.first+" "+s.last);
			}
			g.drawString(s.first+" "+s.last, 800, 840);
			
			///////Grade & Homeroom///////
			fontSize = 80;
			g.setFont(new Font("Arial",Font.PLAIN,fontSize));
			fm = g.getFontMetrics();
			width = fm.stringWidth(s.grade+": "+s.homeroom);
			
			while(width>1500)
			{
				fontSize--;
				g.setFont(new Font("Arial",Font.PLAIN,fontSize));
				fm = g.getFontMetrics();
				width = fm.stringWidth(s.grade+": "+s.homeroom);
			}
			g.drawString(s.grade+": "+s.homeroom, 800, 940);
			
			///////School Name///////
			fontSize = 80;
			g.setFont(new Font("Arial",Font.PLAIN,fontSize));
			fm = g.getFontMetrics();
			width = fm.stringWidth(data.schoolName);
			
			while(width>1500)
			{
				fontSize--;
				g.setFont(new Font("Arial",Font.PLAIN,fontSize));
				fm = g.getFontMetrics();
				width = fm.stringWidth(data.schoolName);
			}
			g.drawString(data.schoolName, 800, 1040);
			
			///////Barcode///////
			fontSize = 50;
			g.setFont(new Font("Arial",Font.PLAIN,fontSize));
			g.drawString("Ref Num: "+s.ref, 100, 1540);
			g.setFont(new Font("Code39FiveText",Font.PLAIN,90));
			g.drawString("*"+s.ref+"*", 100, 1640);		
			
			
			/////////Composites////////////
			g.setFont(new Font("Arial",Font.PLAIN,70));
			g.drawString("------Order------", 800, 1140);
			int yTemp = 1240;
			if(sComp>0)
			{
				g.drawString(order+" StarComposite count: "+sComp, 800, yTemp);
				yTemp+=110;
			}
			if(tComp>0) g.drawString(order+"ClassComposite count: "+tComp, 800, yTemp);
			
			//////Vertical Teacher Name//////
			g.rotate(Math.PI/2);
			g.setFont(new Font("Arial",Font.PLAIN,80));
			g.drawString(s.grade+": "+s.homeroom, 740, -2500);
			g.rotate(-Math.PI/2);
			
			
			ImageIO.write(bImage, "jpg", new File(textField_3.getText()+"\\Envelopes\\"+s.homeroom+"_"+s.last+"_"+s.first+"_"+labelCount+".jpg"));
			bImage.flush();
			bImage = null;
			
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error with label: "+e);}
		
	}
	private void labels(Student s, int sComp, int tComp, String order)
	{
		try
		{
			labelCount++;
			BufferedImage bImage = new BufferedImage(1200,600,BufferedImage.TYPE_INT_RGB);
			Image stuImg;
			Graphics2D g = bImage.createGraphics();
			g.setColor(Color.white);
			g.fillRect(0,0,600,1200);
			if(label!=null) g.drawImage(label, 0, 0, null);
			
			File stuMed = new File(stuGUI.schoolPath+"\\CroppedMed\\"+s.ref+".jpg");
			if(stuMed.exists())
			{
				stuImg = ImageIO.read(stuMed).getScaledInstance(280, -1, Image.SCALE_SMOOTH);
				g.drawImage(stuImg,20,20,null);
				stuImg.flush();
				stuImg = null;
			}
			g.setColor(Color.black);
			///////First and Last Name///////
			fontSize = 100;
			g.setFont(new Font("Arial",Font.PLAIN,fontSize));
			fm = g.getFontMetrics();
			width = fm.stringWidth(s.first+" "+s.last);
			
			while(width>850)
			{
				fontSize--;
				g.setFont(new Font("Arial",Font.PLAIN,fontSize));
				fm = g.getFontMetrics();
				width = fm.stringWidth(s.first+" "+s.last);
			}
			g.drawString(s.first+" "+s.last, 330, 120);
			
			///////Grade & Homeroom///////
			fontSize = 60;
			g.setFont(new Font("Arial",Font.PLAIN,fontSize));
			fm = g.getFontMetrics();
			width = fm.stringWidth(s.grade+": "+s.homeroom);
			
			while(width>850)
			{
				fontSize--;
				g.setFont(new Font("Arial",Font.PLAIN,fontSize));
				fm = g.getFontMetrics();
				width = fm.stringWidth(s.grade+": "+s.homeroom);
			}
			g.drawString(s.grade+": "+s.homeroom, 330, 200);
			
			///////School Name///////
			fontSize = 50;
			g.setFont(new Font("Arial",Font.PLAIN,fontSize));
			fm = g.getFontMetrics();
			width = fm.stringWidth(data.schoolName);
			
			while(width>850)
			{
				fontSize--;
				g.setFont(new Font("Arial",Font.PLAIN,fontSize));
				fm = g.getFontMetrics();
				width = fm.stringWidth(data.schoolName);
			}
			g.drawString(data.schoolName, 330, 260);
			
			/////////Composites////////////
			g.setFont(new Font("Arial",Font.PLAIN,40));
			g.drawString("------Order------", 330, 310);
			int yTemp = 360;
			if(sComp>0)
			{
				g.drawString(order+" StarComposite count: "+sComp, 330, yTemp);
				yTemp+=50;
			}
			if(tComp>0) g.drawString(order+"ClassComposite count: "+tComp, 330, yTemp);
			
			
			ImageIO.write(bImage, "jpg", new File(textField_3.getText()+"\\Labels\\"+s.homeroom+"_"+s.last+"_"+s.first+"_"+labelCount+".jpg"));
			bImage.flush();
			bImage = null;
			
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error with label: "+e);}
		
	}
	
	private void traditionalComposite(Student s, boolean student)
	{
		BufferedImage background = new BufferedImage(3150,2400,BufferedImage.TYPE_INT_RGB);
		Graphics2D bG = background.createGraphics();
		bG.setColor(Color.white);
		bG.fillRect(0, 0, 3150, 2400);
		bG.setColor(Color.black);
		bG.setFont(new Font("Arial",Font.PLAIN,50));
		try{
			if(compositeHR.equals("")||(!compositeHR.equals(s.homeroom)))
			{
				compositeHR = s.homeroom;
				File source = new File(textField_3.getText()+"\\"+s.homeroom+".jpg");
	
				compositeImage = ImageIO.read(source);
			}
			bG.drawImage(compositeImage, 150, 0, null);
			bG.setTransform(AffineTransform.getRotateInstance(Math.toRadians(90)));
			bG.drawString(s.homeroom+": "+s.last+", "+s.first, 450, -50);
			bG.setTransform(AffineTransform.getRotateInstance(Math.toRadians(270)));
			if(student) ImageIO.write(background, "jpg",new File(textField_3.getText()+"\\StudentComposites\\"+s.homeroom+"_"+s.last+"_"+s.first+"_"+cCount+"c.jpg"));
			else ImageIO.write(background, "jpg",new File(textField_3.getText()+"\\Staff\\"+s.homeroom+"_"+s.last+"_"+s.first+"_"+cCount+"c.jpg"));
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Traditional Composite Builder Error: "+s.homeroom+" "+e);}
		cCount++;
		bG.dispose();
		background.flush();
		background = null;
	}
}
