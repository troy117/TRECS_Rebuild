package photo.software.admin.id;

import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FilenameFilter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;

import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;

import net.miginfocom.swing.MigLayout;

import javax.swing.ImageIcon;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JTextField;

import photo.software.comparators.*;
import photo.software.student.Student;
import photo.software.student.Students;
import photo.software.student.lists.ListItem;

import javax.swing.JCheckBox;


@SuppressWarnings("serial")
public class IDCardGUI extends JInternalFrame implements ActionListener
{

	private Students students;
	private String schoolPath,currentRef;
	private ArrayList<Student> inputList, renderList;
	@SuppressWarnings("rawtypes")
	private JComboBox comboBox, comboBox_1, comboBox_2,comboBox_3, comboBox_4,comboBox_5,comboBox_6,comboBox_7;
	private JPanel panel,panel_1;
	private String[] grades, homerooms, tracks, idTemplates;
	private JTextField textField;
	private JLabel label,label_1,lblSortMethod,lblTemplateToPreview,idLabel;
	private JButton btnRenderIdCards, btnGroupLooseCards;
	
	private BufferedImage img;
	private Image idBackground;
	private ImageIcon idIcon;
	private JPanel panel_3;
	private JLabel lblStudentTemplate;
	private JLabel lblFacultyTemplate;
	private JLabel lblOverrideBackground;
	private JLabel lblOverrideTemplate;
	private IDCardCreator creator;
	private JCheckBox chckbxPhotographedOnly;
	private JCheckBox chckbxRenderIdsIndividually;
	private JLabel lblYear;
	private JTextField textField_1;
	
	
	/**
	 * @wbp.parser.constructor
	 */
	public IDCardGUI(Students students,String schoolPath, String currentRef, String stuID, String facID) 
	{
		//Initialize variables
		this.students = students;
		this.currentRef=currentRef;
		inputList=new ArrayList<Student>();
		for(Student s:students.getStudents())
		{
			if((!s.last.equals(""))&&(!s.first.equals(""))) inputList.add(s);
		}
		this.schoolPath=schoolPath;
		renderList = new ArrayList<Student>();
		creator = new IDCardCreator("");
		ArrayList<String> temp = new ArrayList<String>();
		temp = creator.getTemplates();
		idTemplates = new String[temp.size()];
		for(int i=0;i<temp.size();i++)idTemplates[i]=temp.get(i);
				
		//Build the possible combo box lists for homeroome grade and track
		homeroomList();
		gradeList();
		trackList();
		
		//Set up GUI
		this.setClosable(true);
		setBounds(100, 100, 841, 700);
		getContentPane().setLayout(new MigLayout("", "[300.00,grow][512.00,grow]", "[408.00][150.00][75.00]"));
		this.setVisible(true);
		
		//initialize all fields
		initialize();
		comboBox_4.setSelectedItem(stuID);
		comboBox_5.setSelectedItem(facID);
		
		lblYear = new JLabel("Year:");
		panel.add(lblYear, "cell 0 15,alignx trailing");
		
		textField_1 = new JTextField();
		textField_1.setText("2025-2026");
		panel.add(textField_1, "cell 1 15,growx");
		textField_1.setColumns(10);
	}
	public IDCardGUI(String outputFolder, Students students, String schoolPath, String stuID, String facID) 
	{
		//Initialize variables
		this.students = students;
		this.currentRef="";
		inputList=new ArrayList<Student>();
		for(Student s:students.getStudents())
		{
			if((!s.last.equals(""))&&(!s.first.equals(""))) inputList.add(s);
		}
		this.schoolPath=schoolPath;
		renderList = new ArrayList<Student>();
		creator = new IDCardCreator(outputFolder);
		ArrayList<String> temp = new ArrayList<String>();
		temp = creator.getTemplates();
		idTemplates = new String[temp.size()];
		for(int i=0;i<temp.size();i++)idTemplates[i]=temp.get(i);
				
		//Build the possible combo box lists for homeroome grade and track
		homeroomList();
		gradeList();
		trackList();
		
		//Set up GUI
		this.setClosable(true);
		setBounds(100, 100, 841, 700);
		getContentPane().setLayout(new MigLayout("", "[300.00,grow][512.00,grow]", "[380.00][150.00][75.00]"));
		this.setVisible(true);
		
		//initialize all fields
		initialize();
		comboBox_4.setSelectedItem(stuID);
		comboBox_5.setSelectedItem(facID);
		
		textField_1 = new JTextField();
		textField_1.setText("2025-2026");
		panel.add(textField_1, "cell 1 15,growx");
		textField_1.setColumns(10);
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void initialize()
	{
		panel = new JPanel();
		getContentPane().add(panel, "cell 0 0,grow");
		panel.setLayout(new MigLayout("", "[95px][grow]", "[23px][][][][][][][][][][][][][][][]"));
		
		String[] renderOptions = {"Entire School","Entire Grade","Entire Homeroom","Entire Track","Student","List"};
		
		JLabel lblRenderIdCards = new JLabel("Render ID Cards For:");
		panel.add(lblRenderIdCards, "cell 0 1,alignx trailing");
		comboBox = new JComboBox(renderOptions);
		comboBox.addActionListener(this);
		panel.add(comboBox, "cell 1 1,growx");
		
		comboBox_1 = new JComboBox();
		comboBox_1.setEditable(false);
		comboBox_1.setEnabled(false);
		panel.add(comboBox_1, "cell 1 2,growx");
		
		label = new JLabel("");
		panel.add(label, "cell 0 2,alignx trailing");
		
		textField = new JTextField();
		textField.setEnabled(false);
		panel.add(textField, "cell 1 3,growx");
		textField.setColumns(10);
		
		label_1 = new JLabel("");
		panel.add(label_1, "cell 0 3,alignx trailing");
		
		String[] sortMethods = {"","Alpha By Last","Alpha By Grade","Alpha By Homeroom","Alpha By Track","By ID#"};
		
		chckbxPhotographedOnly = new JCheckBox("Photographed Only");
		panel.add(chckbxPhotographedOnly, "cell 1 4");
		
		lblSortMethod = new JLabel("Sort Method:");
		panel.add(lblSortMethod, "cell 0 5,alignx trailing");
		comboBox_3 = new JComboBox(sortMethods);
		panel.add(comboBox_3, "cell 1 5,growx");
		
		lblStudentTemplate = new JLabel("Student Template:");
		panel.add(lblStudentTemplate, "cell 0 7,alignx trailing");
		
		comboBox_4 = new JComboBox(idTemplates);
		panel.add(comboBox_4, "cell 1 7,growx");
		
		lblFacultyTemplate = new JLabel("Faculty Template:");
		panel.add(lblFacultyTemplate, "cell 0 8,alignx trailing");
		
		comboBox_5 = new JComboBox(idTemplates);
		panel.add(comboBox_5, "cell 1 8,growx");
		
		btnRenderIdCards = new JButton("Render ID Card Sheet");
		btnRenderIdCards.addActionListener(this);
		panel.add(btnRenderIdCards, "cell 1 13,growx");
		
		lblOverrideBackground = new JLabel("Override Background:");
		panel.add(lblOverrideBackground, "cell 0 10,alignx trailing");
		
		lblOverrideTemplate = new JLabel("Override Template:");
		panel.add(lblOverrideTemplate, "cell 0 11,alignx trailing");
		
		comboBox_7 = new JComboBox(idTemplates);
		panel.add(comboBox_7, "cell 1 11,growx");

		
		panel_1 = new JPanel();
		getContentPane().add(panel_1, "cell 1 0 1 2,grow");
		
		panel_3 = new JPanel();
		getContentPane().add(panel_3, "cell 0 1 1 2,grow");
		
		btnGroupLooseCards = new JButton("Group Loose Cards");
		btnGroupLooseCards.addActionListener(this);
		panel_3.add(btnGroupLooseCards,"cell 1 1,growx");

		
		
		panel_3.setLayout(new MigLayout("", "[290.00]", "[200.00]"));
		
		JPanel panel_2 = new JPanel();
		getContentPane().add(panel_2, "cell 1 2,grow");
		panel_2.setLayout(new MigLayout("", "[][94.00][][][94.00]", "[]"));
		
		lblTemplateToPreview = new JLabel("Template to Preview:");
		panel_2.add(lblTemplateToPreview, "cell 0 0");
		
		File templates = new File(schoolPath+"\\Templates");
		String[] backgrounds=templates.list(new FilenameFilter(){
			public boolean accept(File dir, String name) 
			{
				if(name.lastIndexOf('.')>0)
				{
					int lastIndex = name.lastIndexOf('.');
					String str = name.substring(lastIndex);
					if(str.equals(".bmp")||str.equals(".jpg")) return true;
				}
				return false;
			}
		});
		
		idIcon = new ImageIcon();
		idLabel = new JLabel();
		
		
		if(backgrounds!=null)
		{
			comboBox_6 = new JComboBox();
			comboBox_6.addItem("");
			for(String s:backgrounds) comboBox_6.addItem(s);
			comboBox_2 = new JComboBox(backgrounds);
			comboBox_2.addActionListener(this);
			displayID();
		}
		else
		{
			comboBox_6 = new JComboBox();
			comboBox_6.addItem("");
			comboBox_6.setVisible(false);
			comboBox_2 = new JComboBox();
			comboBox_2.setEnabled(false);
			
			JOptionPane.showMessageDialog(null,"There are no ID card templates!");
		}
		panel.add(comboBox_6, "cell 1 10,growx");
		
		chckbxRenderIdsIndividually = new JCheckBox("Render IDs Individually");
		panel.add(chckbxRenderIdsIndividually, "cell 1 14");
		panel_2.add(comboBox_2, "cell 1 0,growx");
		
	}
	public void actionPerformed(ActionEvent e) 
	{
		Object pressed = e.getSource();
		if(pressed==comboBox)
		{
			selectSubCategory();
		}
		else if(pressed==btnRenderIdCards)
		{
			buildRenderList();
			sortAndRender();
		}
		else if(pressed==comboBox_2)
		{
			displayID();
		}
		else if(pressed==btnGroupLooseCards)
		{
			new IDCardCreator("").standaloneSheetGenerator();
		}

	}
	
	private void displayID()
	{
		try
		{
			panel_1.removeAll();
			img = ImageIO.read(new File(schoolPath+"\\Templates\\"+comboBox_2.getSelectedItem().toString()));
			if(img.getWidth()>=img.getHeight())	idBackground = img.getScaledInstance(400, -1, Image.SCALE_SMOOTH);
			else idBackground = img.getScaledInstance(-1, 255, Image.SCALE_SMOOTH);
			idIcon.setImage(idBackground);
			idLabel.setIcon(idIcon);
			panel_1.add(idLabel);
			
		}catch(Exception err){JOptionPane.showMessageDialog(null,"Background Draw Error: "+err);}
		panel_1.repaint();
	}
	
	///////Selects and updates GUI with sub category
	@SuppressWarnings("unchecked")
	private void selectSubCategory()
	{
		if(comboBox.getSelectedIndex()==0)
		{
			comboBox_1.removeAllItems();
			comboBox_1.setEnabled(false);
			comboBox_1.updateUI();
			
			textField.setText("");
			textField.setEnabled(false);
			
			label.setText("");
			label_1.setText("");
		}
		else if(comboBox.getSelectedIndex()==1)
		{
			comboBox_1.removeAllItems();
			comboBox_1.setEnabled(true);
			for(String g:grades) comboBox_1.addItem(g);
			comboBox_1.updateUI();
			
			textField.setText("");
			textField.setEnabled(false);
			
			label.setText("Select Grade:");
			label_1.setText("");
		}
		else if(comboBox.getSelectedIndex()==2)
		{
			comboBox_1.removeAllItems();
			comboBox_1.setEnabled(true);
			for(String h:homerooms) comboBox_1.addItem(h);
			comboBox_1.updateUI();
			
			textField.setText("");
			textField.setEnabled(false);
			
			label.setText("Select Homeroom");
			label_1.setText("");
		}
		else if(comboBox.getSelectedIndex()==3)
		{
			comboBox_1.removeAllItems();
			comboBox_1.setEnabled(true);
			for(String t:tracks) comboBox_1.addItem(t);
			comboBox_1.updateUI();
			
			textField.setText("");
			textField.setEnabled(false);
			
			label.setText("Select Track");
			label_1.setText("");
		}
		else if(comboBox.getSelectedIndex()==4)
		{
			comboBox_1.removeAllItems();
			comboBox_1.setEnabled(false);
			comboBox_1.updateUI();

			textField.setEnabled(true);
			
			label.setText("");
			label_1.setText("Ref Number");
			textField.setText(currentRef);
		}
		else if(comboBox.getSelectedIndex()==5)
		{

			students.loadListDatabase();
			comboBox_1.removeAllItems();
			comboBox_1.setEnabled(true);
			for(String s:students.getListNames()) comboBox_1.addItem(s);
			comboBox_1.updateUI();
			textField.setText("");
			textField.setEnabled(false);
			
			label.setText("Select List");
			label_1.setText("");
			
		}
	}
	///////Creates the selection list for homeroom, grade, and track
	
	//Selection list for homeroom
	private void homeroomList()
	{
		HashSet<String> home = new HashSet<String>();
		for(Student s: inputList)
		{
			home.add(s.homeroom);
		}
		homerooms = new String[home.size()];
		home.toArray(homerooms);
	}
	//Selection list for grades
	private void gradeList()
	{
		HashSet<String> grade = new HashSet<String>();
		for(Student s: inputList)
		{
			grade.add(s.grade);
		}
		grades = new String[grade.size()];
		grade.toArray(grades);
	}
	//Selection for tracks
	private void trackList()
	{
		HashSet<String> track = new HashSet<String>();
		for(Student s: inputList)
		{
			track.add(s.track);
		}
		tracks = new String[track.size()];
		track.toArray(tracks);
	}
	
	//Builds the Render List based off of combo box selection
	private void buildRenderList()
	{
		if(comboBox.getSelectedIndex()==0) 
		{
			renderList.clear();
			renderList.addAll(inputList);
		}
		//Render selected Grade
		else if(comboBox.getSelectedIndex()==1)
		{
			renderList.clear();
			for(Student s:inputList)
			{
				if(s.grade.equals(comboBox_1.getSelectedItem())) renderList.add(s);
			}
		}
		//Render selected Homeroom
		else if(comboBox.getSelectedIndex()==2)
		{
			renderList.clear();
			for(Student s:inputList)
			{
				if(s.homeroom.equals(comboBox_1.getSelectedItem())) renderList.add(s);
			}
		}
		//Render selected Track
		else if(comboBox.getSelectedIndex()==3)
		{
			renderList.clear();
			for(Student s:inputList)
			{
				if(s.track.equals(comboBox_1.getSelectedItem())) renderList.add(s);
			}
		}
		//Individual Student
		else if(comboBox.getSelectedIndex()==4)
		{
			renderList.clear();
			for(Student s:inputList)
			{
				if(s.ref.equals(textField.getText()))
				{
					renderList.add(s);
					break;
				}
			}
		}
		//Student List
		else if(comboBox.getSelectedIndex()==5)
		{
			renderList.clear();
			for(ListItem l:students.getListItems())
			{
				if(l.getList().equals(comboBox_1.getSelectedItem()))
				{
					renderList.add(l.getStudent());
				}
			}
		}
	}
	
	//Sorts and Renders the renderList of students
	private void sortAndRender()
	{
		Iterator<Student> it = renderList.iterator();
		while(it.hasNext()){
			if(it.next().grade.equals("EXMPT")) it.remove();
		}
		if(comboBox_3.getSelectedIndex()==0)
		{
			JOptionPane.showMessageDialog(null, "CHOOSE SORT!");
			return;
		}
		else if(comboBox_3.getSelectedIndex()==1)
		{
			Collections.sort(renderList,new StudentLastNameSortComparator());
		}
		else if(comboBox_3.getSelectedIndex()==2)
		{
			Collections.sort(renderList,new StudentGradeSortComparator());
		}
		else if(comboBox_3.getSelectedIndex()==3)
		{
			Collections.sort(renderList,new StudentClassSortComparator());
		}
		else if(comboBox_3.getSelectedIndex()==4)
		{
			Collections.sort(renderList,new StudentTrackSortComparator());
		}
		else if(comboBox_3.getSelectedIndex()==5)
		{
			Collections.sort(renderList,new StudentIDSortComparator());
		}
		if(chckbxPhotographedOnly.isSelected())
		{
			it = renderList.iterator();
			while(it.hasNext())
			{
				if(!it.next().photo.equals("true")) it.remove();
			}
		}
		//Conditions
		creator.setYear(textField_1.getText());
		if(comboBox_6.getSelectedIndex()!=0&&comboBox_7.getSelectedIndex()!=0)
			creator.override((String)comboBox_6.getSelectedItem(),(String)comboBox_7.getSelectedItem(),renderList,schoolPath,chckbxRenderIdsIndividually.isSelected());
		else if(comboBox_4.getSelectedIndex()!=0&&comboBox_5.getSelectedIndex()!=0)
		{
			creator.regular((String)comboBox_4.getSelectedItem(),(String)comboBox_5.getSelectedItem(),renderList, schoolPath, chckbxRenderIdsIndividually.isSelected());
		}
		else JOptionPane.showMessageDialog(null, "Set Combo Box Values Even if not used");
	}
}
