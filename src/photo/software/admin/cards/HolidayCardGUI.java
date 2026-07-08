package photo.software.admin.cards;

import java.awt.Color;

import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.UIManager;

import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.FilenameFilter;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JButton;
import javax.swing.border.TitledBorder;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.InternalFrameListener;
import javax.swing.JCheckBox;
import javax.swing.JProgressBar;
import javax.swing.JComboBox;

import photo.software.student.Student;
import photo.software.student.Students;

import javax.swing.JTextField;

@SuppressWarnings("serial")
public class HolidayCardGUI extends JInternalFrame implements ActionListener{

	private Students students;
	private String schoolPath, schoolName;
	private JButton btnRunHoliday, btnRunValentine;
	private JCheckBox chckbxBagLabels, chckbxTeacherEnvelopes, chckbxCards,
						chckbxBagLabels_1, chckbxTeacherEnvelopes_1, chckbxCards_1;
	private JProgressBar progressBar;
	JComboBox<String> comboBox, comboBox_1;
	private ArrayList<String> homerooms, grades;
	private JLabel lblStatus;
	private Thread renderThread;
	private JCheckBox chckbxExcelList;
	private JCheckBox chckbxExcelList_1;
	private JTextField txtHolidayFundraiser;
	private JTextField txtValentineFundraiser;
	private JComboBox<String> comboBox_2, comboBox_3;
	
	
	private JButton btnRunPerferatedCards;
	
	public HolidayCardGUI(Students students, String schoolPath, String schoolName) {
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
		this.students = students;
		this.schoolPath = schoolPath;
		this.schoolName = schoolName;
		initializeComboBoxes();
		
		setBounds(100, 100, 600, 485);
		getContentPane().setLayout(new MigLayout("", "[251.00][250.00]", "[][][][][][250.00][25.00][25.00]"));
		
		JLabel lblTrecsHolidayCard = new JLabel("TRECS Holiday Card Creator!");
		lblTrecsHolidayCard.setFont(new Font("Tahoma", Font.PLAIN, 20));
		getContentPane().add(lblTrecsHolidayCard, "cell 0 0 2 1,alignx center");
		
		comboBox = new JComboBox<String>();
		comboBox.addItem("All Students");
		comboBox.addItem("Grade");
		comboBox.addItem("Homeroom");
		comboBox.addItem("List");
		comboBox.addActionListener(this);
		getContentPane().add(comboBox, "cell 0 2 2 1,grow");
		
		comboBox_1 = new JComboBox<String>();
		comboBox_1.setVisible(false);
		getContentPane().add(comboBox_1, "cell 0 3 2 1,growx");
		
		JPanel panel = new JPanel();
		panel.setBorder(new TitledBorder(UIManager.getBorder("TitledBorder.border"), "Holiday Cards", TitledBorder.CENTER, TitledBorder.TOP, null, new Color(0, 0, 0)));
		getContentPane().add(panel, "cell 0 5,grow");
		panel.setLayout(new MigLayout("", "[grow]", "[][][][][][][]"));
		
		txtHolidayFundraiser = new JTextField();
		txtHolidayFundraiser.setText("Holiday 2025");
		panel.add(txtHolidayFundraiser, "cell 0 0,growx");
		txtHolidayFundraiser.setColumns(10);
		
		chckbxBagLabels = new JCheckBox("Bag Labels");
		panel.add(chckbxBagLabels, "cell 0 1");
		
		chckbxTeacherEnvelopes = new JCheckBox("Teacher Envelopes");
		panel.add(chckbxTeacherEnvelopes, "cell 0 2");
		
		comboBox_2 = new JComboBox<String>();
		comboBox_2.addItem("");
		if(new File("Templates\\Holiday").exists())
			
		{
			String[] studentEnvelopesHoliday = new File("Templates\\Holiday").list(new FilenameFilter(){
				public boolean accept(File arg0, String arg1) {
					if(arg1.contains("StudentEnvelope")) return true;
					return false;
				}
			});
			for(String e:studentEnvelopesHoliday) comboBox_2.addItem(e);
		}
		panel.add(comboBox_2, "cell 0 3,growx");
		
		chckbxCards = new JCheckBox("Cards");
		panel.add(chckbxCards, "cell 0 4");
		
		btnRunHoliday = new JButton("Run");
		btnRunHoliday.addActionListener(this);
		
		chckbxExcelList = new JCheckBox("Excel List");
		panel.add(chckbxExcelList, "cell 0 5");
		panel.add(btnRunHoliday, "cell 0 6,growx");
		
		JPanel panel_1 = new JPanel();
		panel_1.setBorder(new TitledBorder(UIManager.getBorder("TitledBorder.border"), "Valentines Cards", TitledBorder.CENTER, TitledBorder.TOP, null, new Color(0, 0, 0)));
		getContentPane().add(panel_1, "cell 1 5,grow");
		panel_1.setLayout(new MigLayout("", "[grow]", "[][][][][][][][]"));
		
		txtValentineFundraiser = new JTextField();
		txtValentineFundraiser.setText("Valentine 2025");
		panel_1.add(txtValentineFundraiser, "cell 0 0,growx");
		txtValentineFundraiser.setColumns(10);
		
		chckbxBagLabels_1 = new JCheckBox("Bag Labels");
		panel_1.add(chckbxBagLabels_1, "cell 0 1");
		
		chckbxTeacherEnvelopes_1 = new JCheckBox("Teacher Envelopes");
		panel_1.add(chckbxTeacherEnvelopes_1, "flowx,cell 0 2");
		
		comboBox_3 = new JComboBox<String>();
		comboBox_3.addItem("");
		if(new File("Templates\\Valentine").exists())
		{
			String[] studentEnvelopesValentine = new File("Templates\\Valentine").list(new FilenameFilter(){
				public boolean accept(File arg0, String arg1) {
					if(arg1.contains("StudentEnvelope")) return true;
					return false;
				}
			});
			for(String e:studentEnvelopesValentine) comboBox_3.addItem(e);
		}
		
		panel_1.add(comboBox_3, "cell 0 3,growx");
		
		chckbxCards_1 = new JCheckBox("Cards");
		panel_1.add(chckbxCards_1, "flowx,cell 0 4");
		
		btnRunValentine = new JButton("Run");
		btnRunValentine.addActionListener(this);
		
		chckbxExcelList_1 = new JCheckBox("Excel List");
		panel_1.add(chckbxExcelList_1, "cell 0 5");
		panel_1.add(btnRunValentine, "cell 0 6,growx");
		
		btnRunPerferatedCards = new JButton("Run Perferated Cards");
		btnRunPerferatedCards.addActionListener(this);
		panel_1.add(btnRunPerferatedCards, "cell 0 7,growx");
				
		progressBar = new JProgressBar();
		getContentPane().add(progressBar, "cell 0 6 2 1,grow");
		
		lblStatus = new JLabel("Status");
		getContentPane().add(lblStatus, "cell 0 7 2 1,growy");

	}
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed= arg0.getSource();
		if(pressed==comboBox)
		{
			updateComboBox();
		}
		if(pressed==btnRunHoliday)
		{
			runHoliday();
		}
		if(pressed==btnRunValentine)
		{
			runValentine();
		}
		if(pressed==btnRunPerferatedCards)
		{
			runPerferatedValentine();
		}
	}
	public void updateProgressBar(int current, String text)
	{
		progressBar.setValue(current);
		lblStatus.setText(text);
	}
	private ArrayList<Student> getStudents()
	{
		ArrayList<Student> exportV = new ArrayList<Student>();
		if(comboBox.getSelectedIndex()==0) for(Student s: students.getStudents()) exportV.add(s);
		if(comboBox.getSelectedIndex()==1) for(Student s: students.getStudents()) if(s.grade.equals(comboBox_1.getSelectedItem())) exportV.add(s);
		if(comboBox.getSelectedIndex()==2) for(Student s: students.getStudents()) if(s.homeroom.equals(comboBox_1.getSelectedItem())) exportV.add(s);
		if(comboBox.getSelectedIndex()==3) exportV.addAll(students.getStudentsFromList((String)comboBox_1.getSelectedItem()));
		return exportV;
	}
	private void runHoliday()
	{
		JFileChooser fc = new JFileChooser();
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showOpenDialog(null);
		if(returnVal==JFileChooser.APPROVE_OPTION)
		{
			File holidayFolder = new File(fc.getSelectedFile().getAbsolutePath()+"\\"+schoolName+" HOLIDAY");
			holidayFolder.mkdir();
			ArrayList<Student> cardList = getStudents();
			if(chckbxExcelList.isSelected()) new CardExcelListExport(cardList, holidayFolder.getAbsolutePath(), schoolName);
			HolidayCardExport holiday = new HolidayCardExport(this,cardList,holidayFolder.getAbsolutePath(), schoolPath, schoolName);
			holiday.setValues(txtHolidayFundraiser.getText().trim(),chckbxBagLabels.isSelected(), chckbxTeacherEnvelopes.isSelected(), (String)comboBox_2.getSelectedItem(), chckbxCards.isSelected());
			renderThread = new Thread(holiday);
			renderThread.start();
		}
		
	}
	
	private void runPerferatedValentine()
	{
		JFileChooser fc = new JFileChooser();
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showOpenDialog(null);
		if(returnVal==JFileChooser.APPROVE_OPTION)
		{
			File holidayFolder = new File(fc.getSelectedFile().getAbsolutePath()+"\\"+schoolName+" VALENTINE");
			holidayFolder.mkdir();
			ArrayList<Student> cardList = getStudents();
			if(chckbxExcelList_1.isSelected()) new CardExcelListExport(cardList, holidayFolder.getAbsolutePath(), schoolName);
			else
			{
				ValentinesCardExportPerferated pValentine = new ValentinesCardExportPerferated(this, cardList, holidayFolder.getAbsolutePath(), schoolPath, schoolName);
				pValentine.setValues(txtValentineFundraiser.getText().trim(), chckbxTeacherEnvelopes_1.isSelected(),
						(String)comboBox_3.getSelectedItem(),chckbxCards_1.isSelected(),chckbxBagLabels_1.isSelected());
				renderThread = new Thread(pValentine);
				renderThread.start();
			}
		}
	}
	
	private void runValentine()
	{
		JFileChooser fc = new JFileChooser();
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showOpenDialog(null);
		if(returnVal==JFileChooser.APPROVE_OPTION)
		{
			File holidayFolder = new File(fc.getSelectedFile().getAbsolutePath()+"\\"+schoolName+" VALENTINE");
			holidayFolder.mkdir();
			ArrayList<Student> cardList = getStudents();
			if(chckbxExcelList_1.isSelected()) new CardExcelListExport(cardList, holidayFolder.getAbsolutePath(), schoolName);
			else
			{
				ValentinesCardExport valentine = new ValentinesCardExport(this,cardList,holidayFolder.getAbsolutePath(), schoolPath, schoolName);
				valentine.setValues(txtValentineFundraiser.getText().trim(),chckbxBagLabels_1.isSelected(), chckbxTeacherEnvelopes_1.isSelected(), 
						(String)comboBox_3.getSelectedItem(), chckbxCards_1.isSelected());
				renderThread = new Thread(valentine);
				renderThread.start();
			}
		}
	}

	private void close() {
	    this.dispose(); // Close the GUI window

	    // Safely stop the render thread
	    if (renderThread != null && renderThread.isAlive()) {
	        renderThread.interrupt(); // Signal the thread to stop
	        try {
	            renderThread.join(); // Wait for the thread to finish
	        } catch (InterruptedException e) {
	            Thread.currentThread().interrupt();
	        }
	        renderThread = null;
	    }
	}
	private void initializeComboBoxes()
	{
		homerooms = new ArrayList<String>();
		grades = new ArrayList<String>();
		homerooms.add("");
		grades.add("");
		for(Student s: students.getStudents())
		{
			if(!homerooms.contains(s.homeroom)) homerooms.add(s.homeroom);
			if(!grades.contains(s.grade)) grades.add(s.grade);
		}
		Collections.sort(homerooms);
		Collections.sort(grades);
	}
	private void updateComboBox()
	{
		if(comboBox.getSelectedIndex()==0)
		{
			comboBox_1.setVisible(false);
		}
		else if(comboBox.getSelectedIndex()==1)
		{
			comboBox_1.removeAllItems();
			comboBox_1.setVisible(true);
			for(String g:grades) comboBox_1.addItem(g);
		}
		else if(comboBox.getSelectedIndex()==2)
		{
			comboBox_1.removeAllItems();
			comboBox_1.setVisible(true);
			for(String g:homerooms) comboBox_1.addItem(g);
		}
		else if(comboBox.getSelectedIndex()==3)
		{
			comboBox_1.removeAllItems();
			comboBox_1.setVisible(true);
			for(String l:students.getListNames()) comboBox_1.addItem(l);
		}
	}
}
