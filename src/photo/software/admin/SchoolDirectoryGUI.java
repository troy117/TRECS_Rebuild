package photo.software.admin;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;

import javax.imageio.ImageIO;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;

import photo.software.comparators.StudentClassFACSortComparator;
import photo.software.comparators.StudentGradeSortComparator;
import photo.software.comparators.StudentLastNameSortComparator;
import photo.software.student.Student;
import photo.software.student.Students;
import net.miginfocom.swing.MigLayout;

import javax.swing.DefaultComboBoxModel;


@SuppressWarnings("serial")
public class SchoolDirectoryGUI extends JInternalFrame implements ActionListener{

	private ArrayList<Student> allStudents, studentsToRender;
	private String schoolPath,schoolName,imgPath,outputPath,homeGrade="";
	private ArrayList<String> listNames;
	private Students students;
	
	private Student previousStudent;
	private int[] col = {125,510,895,1280,1665,2050};
	private int[] row={602,1105,1607,2110,2612};
	private JTextField txtSchoolYear;
	private JTextField txtIslandPhotography;
	private JCheckBox chckbxPhotographedOnly;
	private JComboBox<String> comboBox;

	private BufferedImage img, sticker, bImage;
	private Graphics2D g, bG;
	
	private FontMetrics fm;
	Rectangle2D rect;
	
	private Boolean concatH,concatG,renderReady=false;
	private int count,position;
	private JComboBox<String> comboBox_1, comboBox_2;
	private JButton btnCreateMugbook, btnCreateLibraryBook;
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public SchoolDirectoryGUI(Students students, String schoolPath, String school, String outputPath) {
		this.allStudents = students.getStudents();
		this.schoolPath = schoolPath;
		this.students = students;
		this.listNames = new ArrayList<String>();
		this.listNames = students.getListNames();
		this.outputPath = outputPath;
		imgPath = schoolPath+"\\CroppedMed";
		schoolName = school;
		
		setBounds(100, 100, 600, 501);
		this.setVisible(true);
		this.setClosable(true);
		getContentPane().setLayout(new MigLayout("", "[][grow]", "[][][][][][][][][][][][][][]"));
		
		JLabel lblCreateMugbook = new JLabel("Create Mugbook or Create Library Book");
		getContentPane().add(lblCreateMugbook, "cell 0 0 2 1,alignx center");
		
		txtSchoolYear = new JTextField();
		txtSchoolYear.setText("School Year: 2025 - 2026");
		getContentPane().add(txtSchoolYear, "cell 1 2,growx");
		txtSchoolYear.setColumns(10);
		
		txtIslandPhotography = new JTextField();
		txtIslandPhotography.setText("Island Photography: 559-456-1400");
		getContentPane().add(txtIslandPhotography, "cell 1 3,growx");
		txtIslandPhotography.setColumns(10);
		
		btnCreateMugbook = new JButton("Create Mugbook");
		btnCreateMugbook.addActionListener(this);
		
		comboBox = new JComboBox<String>();
		comboBox.addItem("");
		comboBox.addItem("Alpha by Grade");
		comboBox.addItem("Alpha by Homeroom");
		comboBox.addItem("Alpha by School");
		
		comboBox_1 = new JComboBox<String>();
		comboBox_1.addActionListener(this);
		comboBox_1.setModel(new DefaultComboBoxModel(new String[] {"All Students", "List"}));
		getContentPane().add(comboBox_1, "cell 1 6,growx");
		
		comboBox_2 = new JComboBox<String>();
		comboBox_2.setVisible(false);
		getContentPane().add(comboBox_2, "cell 1 7,growx");
		
		JLabel lblSortMethod = new JLabel("Sort Method:");
		getContentPane().add(lblSortMethod, "cell 0 10,alignx trailing");
		
		getContentPane().add(comboBox, "cell 1 10,growx");
		
		chckbxPhotographedOnly = new JCheckBox("Photographed Only");
		getContentPane().add(chckbxPhotographedOnly, "cell 1 11");
		getContentPane().add(btnCreateMugbook, "cell 1 12,growx");
		
		btnCreateLibraryBook = new JButton("Create Library Book");
		btnCreateLibraryBook.addActionListener(this);
		getContentPane().add(btnCreateLibraryBook, "cell 1 13,growx");

	}

	private void generateLibraryBook()
	{
		studentsToRender = new ArrayList<Student>();
		if(comboBox_1.getSelectedIndex()==0) studentsToRender = allStudents;
		else if(comboBox_1.getSelectedIndex()==1)
		{
			studentsToRender.addAll(students.getStudentsFromList((String)comboBox_2.getSelectedItem()));
		}

		
		imgPath = schoolPath+"\\CroppedMed";
		new LibraryBookCreator(studentsToRender,outputPath,schoolPath+"\\CroppedMed",schoolName);
		this.dispose();
	}



	private void generateMugbook()
	{
		studentsToRender = new ArrayList<Student>();
		if(comboBox_1.getSelectedIndex()==0) studentsToRender = allStudents;
		else if(comboBox_1.getSelectedIndex()==1)
		{
			studentsToRender.addAll(students.getStudentsFromList((String)comboBox_2.getSelectedItem()));
		}
		if(comboBox.getSelectedIndex()==0)
		{
			JOptionPane.showMessageDialog(null, "Choose Sort Method");
			return;
		}
		else if(comboBox.getSelectedIndex()==1)
		{
			Collections.sort(studentsToRender, new StudentGradeSortComparator());
			concatH=false;
			concatG=true;
		}
		else if(comboBox.getSelectedIndex()==2)
		{
			Collections.sort(studentsToRender, new StudentClassFACSortComparator());
			concatH=true;
			concatG=false;
		}
		else if(comboBox.getSelectedIndex()==3)
		{
			Collections.sort(studentsToRender, new StudentLastNameSortComparator());
			concatH=false;
			concatG=false;
		}
		
		previousStudent = new Student();
		count=2;
		
		//Removes Exempt & Empty students from MugBook
		Iterator<Student> it = studentsToRender.iterator();
		Student temp = new Student();
		while(it.hasNext())
		{
			temp = it.next();
			if(temp.grade.equals("EXMPT")||((temp.first.equals(""))&&(temp.last.equals("")))
					||(chckbxPhotographedOnly.isSelected())&&(temp.photo.equals("false"))) it.remove();
		}
		
		try
		{
			bImage = ImageIO.read(new File("Templates\\FALL\\Directory_Cover.jpg"));
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			int fontSize = 300, width;
			bG.setFont(new Font("Myriad Pro", Font.PLAIN, fontSize));
			
			
			FontMetrics fm = bG.getFontMetrics();
			width = fm.stringWidth(schoolName);
			while(width>2100)
			{
				fontSize--;
				bG.setFont(new Font("Myriad Pro", Font.PLAIN, fontSize));
				fm = bG.getFontMetrics();
				width = fm.stringWidth(schoolName);
			}
			bG.drawString(schoolName, (1300-(width/2)), 600);
			ImageIO.write(bImage, "jpg", new File(outputPath+"\\MugBook_"+schoolName+"_0.jpg"));
			
			bImage = new BufferedImage(2550,3300,BufferedImage.TYPE_INT_RGB);
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			bG.fillRect(0, 0, 2550, 3300);
			ImageIO.write(bImage, "jpg", new File(outputPath+"\\MugBook_"+schoolName+"_1.jpg"));
			position=0;
			for(int i=0;i<studentsToRender.size();i++)
			{
				if(concatH&&renderReady&&(!studentsToRender.get(i).homeroom.equals(previousStudent.homeroom))) renderPage();
				else if(concatG&&renderReady&&(!studentsToRender.get(i).grade.equals(previousStudent.grade))) renderPage();
				else if(position==30) renderPage();
				if(position==0)
				{
					//fName = students.get(i).last;
					//lName = students.get(i).first;
					if(concatH) homeGrade = "Homeroom: " + studentsToRender.get(i).homeroom;
					else homeGrade = "Grade: " + studentsToRender.get(i).grade;
				}
				createCellBlock(studentsToRender.get(i));
				writeToPage(position);
				previousStudent=studentsToRender.get(i);
			}
			renderPage();
			renderBlanks();
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Error Proccessing: "+e);}
		this.dispose();
	}
	private void createCellBlock(Student s)
	{
		//lName = s.last;
		sticker = new BufferedImage(375,489,BufferedImage.TYPE_INT_RGB);
		g = sticker.createGraphics();
		g.setColor(Color.white);
		g.fillRect(0, 0, 375, 489);
		g.setFont(new Font("Arial", Font.PLAIN,24));
		g.setColor(Color.black);
		g.drawRect(0, 0, 374, 488);
		g.drawString("Last: "+s.last, 27, 428);
		g.drawString("First: "+s.first, 27, 458);
		g.drawString(s.grade+" "+s.homeroom+"  "+s.ID, 27, 487);
		g.setColor(Color.white);
		if(s.photo.equals("true"))
		{
			try
			{
				img = ImageIO.read(new File(imgPath+"\\"+s.ref+".jpg"));
				if(img.getWidth()>320) g.drawImage(img.getScaledInstance(320, -1, Image.SCALE_SMOOTH),27,0,null);
				else g.drawImage(img, 27, 0, null);
			}catch(Exception e){JOptionPane.showMessageDialog(null,"Error opening student: "+e+"\n"+s.ref);}
		}
		else
		{
			g.setFont(new Font("Arial", Font.PLAIN,40));
			g.setColor(Color.black);
			fm = g.getFontMetrics();
			rect = fm.getStringBounds("NOT", g);
			g.drawString("NOT", 187-((int)rect.getWidth()/2), 220);
			rect = fm.getStringBounds("PHOTOGRAPHED", g);			
			g.drawString("PHOTOGRAPHED", 187-((int)rect.getWidth()/2), 270);
		}
	}
	private void updateComboBoxes()
	{
		if(comboBox_1.getSelectedIndex()==0)
		{
			comboBox_2.removeAllItems();
			comboBox_2.setVisible(false);
		}
		else if(comboBox_1.getSelectedIndex()==1)
		{
			comboBox_2.removeAllItems();
			comboBox_2.setVisible(true);
			for(String n:listNames) comboBox_2.addItem(n);
		}
		
		
	}
	private void renderBlanks() throws IOException
	{
		bG.setColor(Color.white);
		while((count-2)%4!=0)
		{
			ImageIO.write(bImage, "jpg", new File(outputPath+"\\MugBook_"+schoolName+"_"+count+".jpg"));
			count++;
		}
		ImageIO.write(bImage, "jpg", new File(outputPath+"\\MugBook_"+schoolName+"_"+count+".jpg"));
		count++;
		bImage = ImageIO.read(new File("Templates\\FALL\\Directory_Cover_BACK.jpg"));
		ImageIO.write(bImage, "jpg", new File(outputPath+"\\MugBook_"+schoolName+"_"+count+"LAST.jpg"));
		
	}
	private void renderPage() throws IOException
	{
		bG.setColor(Color.black);
		bG.setFont(new Font("Arial",Font.PLAIN,100));
		fm  = g.getFontMetrics(new Font("Arial",Font.PLAIN,100));
		
		//School Name
		rect = fm.getStringBounds(schoolName, bG);
		bG.drawString(schoolName, 1275-((int)rect.getWidth()/2), 200);
		
		bG.setFont(new Font("Arial",Font.PLAIN,50));
		fm = g.getFontMetrics(new Font("Arial",Font.PLAIN,50));
		//School Year
		rect = fm.getStringBounds(txtSchoolYear.getText(), bG);
		bG.drawString(txtSchoolYear.getText(), 1275-((int)rect.getWidth()/2), 270);
		//Homeroom or Grade
		rect = fm.getStringBounds(homeGrade, bG);
		bG.drawString(homeGrade,1275-((int)rect.getWidth()/2),340);
		//Last name of first and last student on page
		//rect = fm.getStringBounds(fName+" - "+lName, bG);
		//bG.drawString(fName+" - "+lName,1275-((int)rect.getWidth()/2),410);
		//Island Photography Contact Info
		rect = fm.getStringBounds(txtIslandPhotography.getText(), bG);
		bG.drawString(txtIslandPhotography.getText(), 1275-((int)rect.getWidth()/2), 3200);
		
		if(count%2!=0)	bG.drawString("Page: "+count, 100, 100);
		else
		{
			rect = fm.getStringBounds("Page: "+count, bG);
			bG.drawString("Page: "+count, 2450-(int)rect.getWidth(), 100);
		}
		//Write Mugbook Page
		ImageIO.write(bImage, "jpg", new File(outputPath+"\\MugBook_"+schoolName+"_"+count+".jpg"));
		//Reset Mugbook Page to blank
		count++;
		bG.setColor(Color.white);
		bG.fillRect(0, 0, 2550, 3300);
		position=0;
	}
	private void writeToPage(int index)
	{
		renderReady = true;
		try	{bG.drawImage(sticker, col[(index%6)], row[(index/6)], null);}
		catch(Exception e){JOptionPane.showMessageDialog(null,"Error filling sticker page: "+e);}
		position++;
	}
	@Override
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		if(pressed == comboBox_1)
		{
			updateComboBoxes();
		}
		else if(pressed==btnCreateMugbook){generateMugbook();}
		else if(pressed==btnCreateLibraryBook){generateLibraryBook();}
		
	}

}
