package photo.software.student.file;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;

import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JComboBox;
import javax.swing.JButton;
import javax.swing.JOptionPane;

import photo.software.comparators.StudentClassSortComparator;
import photo.software.comparators.StudentGradeSortComparator;
import photo.software.comparators.StudentIDSortComparator;
import photo.software.comparators.StudentLastNameSortComparator;
import photo.software.comparators.StudentTrackSortComparator;
import photo.software.login.SchoolData;
import photo.software.student.Student;
import photo.software.student.StudentGUI;
import photo.software.student.Students;
import photo.software.student.lists.ListItem;

@SuppressWarnings("serial")
public class CameraCardGUI extends JInternalFrame implements ActionListener
{
	private ArrayList<Student> renderList;
	private StudentGUI studentGUI;
	private Students students;
	private JComboBox<String> comboBox, comboBox_1, comboBox_2;
	private JButton btnCreateCameraCards;
	private SchoolData data;
	private String[] GRADES = {"","EXMPT","FAC","PRE","TK","KIN","01","02","03","04","05","06",
			"07","08","09","10","11","12","13","14","15"};
	
	public CameraCardGUI(StudentGUI studentGUI, Students students, SchoolData data) {
		this.studentGUI = studentGUI;
		this.students = students;
		this.data = data;
		renderList = new ArrayList<Student>();
		setBounds(100, 100, 350, 200);
		getContentPane().setLayout(new MigLayout("", "[][206.00]", "[][][][][][]"));
		
		JLabel lblRenderCameraCards = new JLabel("Render Camera Cards for:");
		getContentPane().add(lblRenderCameraCards, "cell 0 1,alignx right");
		
		comboBox = new JComboBox<String>();
		comboBox.addItem("Entire School");
		comboBox.addItem("Grade");
		comboBox.addItem("Homeroom");
		comboBox.addItem("Track");
		comboBox.addItem("List");
		comboBox.addActionListener(this);
		getContentPane().add(comboBox, "cell 1 1,growx");
		
		comboBox_1 = new JComboBox<String>();
		comboBox_1.setEnabled(false);
		getContentPane().add(comboBox_1, "cell 1 2,growx");
		
		JLabel lblSortBy = new JLabel("Sort By:");
		getContentPane().add(lblSortBy, "cell 0 3,alignx right");
		
		comboBox_2 = new JComboBox<String>();
		comboBox_2.addItem("");
		comboBox_2.addItem("Alpha by HOMEROOM");
		comboBox_2.addItem("Alpha by TRACK");
		comboBox_2.addItem("Alpha by GRADE");
		comboBox_2.addItem("Alpha by SCHOOL");
		
		getContentPane().add(comboBox_2, "cell 1 3,growx");
		
		btnCreateCameraCards = new JButton("Create Camera Cards");
		btnCreateCameraCards.addActionListener(this);
		getContentPane().add(btnCreateCameraCards, "cell 1 4,growx");
		this.setVisible(true);
		this.setClosable(true);
		this.setDefaultCloseOperation(DISPOSE_ON_CLOSE);

	}
	private void updateComboBox_1()
	{
		if(comboBox.getSelectedIndex()==0)
		{
			comboBox_1.removeAllItems();
			comboBox_1.setEnabled(false);
			comboBox_1.updateUI();
		}
		else if(comboBox.getSelectedIndex()==1)
		{
			comboBox_1.removeAllItems();
			for(String g:GRADES) comboBox_1.addItem(g);
			comboBox_1.setEnabled(true);
			comboBox_1.updateUI();
		}
		else if(comboBox.getSelectedIndex()==2)
		{
			comboBox_1.removeAllItems();
			for(String h:studentGUI.homerooms) comboBox_1.addItem(h);
			comboBox_1.setEnabled(true);
			comboBox_1.updateUI();
		}
		else if(comboBox.getSelectedIndex()==3)
		{
			comboBox_1.removeAllItems();
			for(String t:studentGUI.tracks) comboBox_1.addItem(t);
			comboBox_1.setEnabled(true);
			comboBox_1.updateUI();
		}
		else if(comboBox.getSelectedIndex()==4)
		{
			comboBox_1.removeAllItems();
			for(String l:students.getListNames()) comboBox_1.addItem(l);
			comboBox_1.setEnabled(true);
			comboBox_1.updateUI();
		}
	}
	private void buildRenderList()
	{
		renderList = new ArrayList<Student>();
		if(comboBox.getSelectedIndex()==0)
		{
			renderList.clear();
			renderList.addAll(students.getStudents());
		}
		else if(comboBox.getSelectedIndex()==1)
		{
			renderList.clear();
			for(Student s: students.getStudents())
				if(s.grade.equals(comboBox_1.getSelectedItem())) renderList.add(s);
		}
		else if(comboBox.getSelectedIndex()==2)
		{
			renderList.clear();
			for(Student s: students.getStudents())
				if(s.homeroom.equals(comboBox_1.getSelectedItem())) renderList.add(s);
		}
		else if(comboBox.getSelectedIndex()==3)
		{
			renderList.clear();
			for(Student s: students.getStudents())
				if(s.track.equals(comboBox_1.getSelectedItem())) renderList.add(s);
		}
		else if(comboBox.getSelectedIndex()==4)
		{
			renderList.clear();
			for(ListItem l:students.getListItems())
				if(l.getList().equals(comboBox_1.getSelectedItem())) renderList.add(l.getStudent());
		}
	}
	private void sortAndRender()
	{
		if(comboBox_2.getSelectedIndex()==1)
			Collections.sort(renderList, new StudentClassSortComparator());
			
		else if(comboBox_2.getSelectedIndex()==2)
			Collections.sort(renderList, new StudentTrackSortComparator());
			
		else if(comboBox_2.getSelectedIndex()==3)
			Collections.sort(renderList, new StudentGradeSortComparator());
		else if(comboBox_2.getSelectedIndex()==4)
			Collections.sort(renderList, new StudentLastNameSortComparator());
		else if(comboBox_2.getSelectedIndex()==5)
			Collections.sort(renderList, new StudentIDSortComparator());
		Iterator<Student> it = renderList.iterator();
		Student temp;
		ArrayList<Student> facList = new ArrayList<Student>();
		while(it.hasNext())
		{
			temp = it.next();
			if(temp.grade.equals("FAC"))
			{
				facList.add(temp);
				it.remove();
			}			
		}
		renderList.addAll(facList);
	}
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		if(pressed==comboBox) updateComboBox_1();
		else if(pressed==btnCreateCameraCards)
		{
			JFileChooser j = new JFileChooser();
			j.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int returnVal = j.showOpenDialog(null);
			if(returnVal==JFileChooser.APPROVE_OPTION)
			{
				buildRenderList();
				sortAndRender();
				new CameraCardCreator(renderList,j.getSelectedFile().getAbsolutePath(),data.schoolName);
				String c0="", c1="", c2 = "";
				if(comboBox.getSelectedItem()!=null) c0 = comboBox.getSelectedItem().toString();
				if(comboBox_1.getSelectedItem()!=null) c1 = comboBox_1.getSelectedItem().toString();
				if(comboBox_2.getSelectedItem()!=null) c2 = comboBox_2.getSelectedItem().toString();
				new PictureDayForm(renderList,data.schoolName,c0,c1,c2, j.getSelectedFile().getAbsolutePath());
				
				//new Logger(schoolPath, "Camera cards created. "+renderList.size()+" camera cards created.");
				JOptionPane.showMessageDialog(null, "Success");
			}
		}
	}

}
