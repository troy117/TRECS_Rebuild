package photo.software.verify;


import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JPanel;
import javax.swing.JTable;
import javax.swing.JScrollPane;

import java.awt.Dimension;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.JCheckBox;
import javax.swing.table.DefaultTableModel;

import photo.software.student.ImportStudentData;
import photo.software.student.StudentGUI;
import photo.software.student.Students;



@SuppressWarnings("serial")
public class DataVerifyGUI extends JInternalFrame implements ActionListener
{
	private JTable table_1,table_2;
	private JTextField textField,textField_1,textField_2,textField_4,textField_5,
				textField_6,textField_7,textField_8,textField_9;
	
	private JCheckBox chckbxIncludeHeader;
	@SuppressWarnings("rawtypes")
	private JComboBox comboBox;
	
	private ImportStudentData importStudents;
	
	private JButton btnImportStudentList,btnPreviewInput,btnAddStudents;
	private boolean previewed;
	private JPanel panel_1, panel_3;
	private JScrollPane scrollPane_1, scrollPane_2;
	private Students students;
	
	private String[] table_1ColumnNames = {"Col 1","Col 2", "Col 3", "Col 4", "Col 5", "Col 6", "Col 7", "Col 8","Col 9"};
	private String[] table_2ColumnNames= {"LastName","FirstName","ID_Number",
										"Grade","Homeroom", "Track", "Field1","Field2"};
	
	private String[][] tempTableArray = null;
	private DefaultTableModel model_1, model_2;
	private String schoolPath;
	private StudentGUI studentGUI;
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public DataVerifyGUI(String schoolPath, Students students, StudentGUI studentGUI) 
	{
		this.schoolPath=schoolPath;
		this.students=students;
		this.studentGUI = studentGUI;
		previewed=false;
		
		setBounds(100, 100, 1075, 670);
		this.setVisible(true);
		this.setTitle("Add Students from Excel File");
		this.setClosable(true);
		getContentPane().setLayout(new MigLayout("", "[740.00][309.00]", "[][]"));
		
		panel_1 = new JPanel();
		getContentPane().add(panel_1, "cell 0 0,grow");
		
		scrollPane_1 = new JScrollPane();
		panel_1.add(scrollPane_1);
		
		model_1 = new DefaultTableModel(tempTableArray,table_1ColumnNames);
		table_1 = new JTable(model_1);
		table_1.setPreferredScrollableViewportSize(new Dimension(690, 290));
		scrollPane_1.setViewportView(table_1);
		
		JPanel panel_2 = new JPanel();
		getContentPane().add(panel_2, "cell 1 0,grow");
		panel_2.setLayout(new MigLayout("", "[75.00][:25:25,left][][44.00,grow]", "[][][][][][][][][][][]"));
		
		btnImportStudentList = new JButton("Import Student List");
		btnImportStudentList.addActionListener(this);
		panel_2.add(btnImportStudentList, "cell 0 0 2 1");
		
		chckbxIncludeHeader = new JCheckBox("Include Header");
		panel_2.add(chckbxIncludeHeader, "cell 2 1");
		
		JLabel lblLast = new JLabel("Last:");
		panel_2.add(lblLast, "cell 0 2,alignx trailing");
		
		textField = new JTextField();
		textField.setMaximumSize(new Dimension(20, 20));
		panel_2.add(textField, "cell 1 2,alignx left");
		textField.setColumns(10);
		
		JLabel lblSortStudentsBy = new JLabel("Sort Students By:");
		panel_2.add(lblSortStudentsBy, "cell 2 2,alignx trailing");
		
		//Sort Methods
		String[] sortMethods = {"Last", "Grade", "Class","ID Number","Track"};
		comboBox = new JComboBox(sortMethods);
		panel_2.add(comboBox, "cell 3 2,growx");
		
		JLabel lblFirst = new JLabel("First:");
		panel_2.add(lblFirst, "cell 0 3,alignx trailing");
		
		textField_1 = new JTextField();
		textField_1.setMaximumSize(new Dimension(20, 20));
		panel_2.add(textField_1, "cell 1 3,growx");
		textField_1.setColumns(10);
		
		JLabel lblAddBlankRecords = new JLabel("Add Blank Records:");
		panel_2.add(lblAddBlankRecords, "cell 2 3,alignx trailing");
		
		textField_9 = new JTextField();
		panel_2.add(textField_9, "cell 3 3,growx");
		textField_9.setColumns(10);
		
		JLabel lblId = new JLabel("ID#");
		panel_2.add(lblId, "cell 0 4,alignx trailing");
		
		textField_2 = new JTextField();
		textField_2.setMaximumSize(new Dimension(20, 20));
		panel_2.add(textField_2, "cell 1 4,growx");
		textField_2.setColumns(10);
		
		JLabel lblGrade = new JLabel("Grade:");
		panel_2.add(lblGrade, "cell 0 5,alignx trailing");
		
		textField_4 = new JTextField();
		textField_4.setMaximumSize(new Dimension(20, 20));
		panel_2.add(textField_4, "cell 1 5,growx");
		textField_4.setColumns(10);
		
		JLabel lblTeacher = new JLabel("Teacher:");
		panel_2.add(lblTeacher, "cell 0 6,alignx trailing");
		
		textField_5 = new JTextField();
		textField_5.setMaximumSize(new Dimension(20, 20));
		panel_2.add(textField_5, "cell 1 6,growx");
		textField_5.setColumns(10);
		
		JLabel lblTrack = new JLabel("Track:");
		panel_2.add(lblTrack, "cell 0 7,alignx trailing");
		
		textField_6 = new JTextField();
		textField_6.setMaximumSize(new Dimension(20, 20));
		panel_2.add(textField_6, "cell 1 7,growx");
		textField_6.setColumns(10);
		
		JLabel lblField1 = new JLabel("Field1:");
		panel_2.add(lblField1, "cell 0 8,alignx trailing");
		
		textField_7 = new JTextField();
		textField_7.setMaximumSize(new Dimension(20, 20));
		panel_2.add(textField_7, "cell 1 8,growx");
		textField_7.setColumns(10);
		
		JLabel lblField2 = new JLabel("Field2:");
		panel_2.add(lblField2, "cell 0 9,alignx trailing");
		
		textField_8 = new JTextField();
		textField_8.setMaximumSize(new Dimension(20, 20));
		panel_2.add(textField_8, "cell 1 9,growx");
		textField_8.setColumns(10);
		
		btnPreviewInput = new JButton("Preview Input");
		btnPreviewInput.addActionListener(this);
		panel_2.add(btnPreviewInput, "cell 0 10 2 1");
		
		btnAddStudents = new JButton("Add Students");
		btnAddStudents.addActionListener(this);
		panel_2.add(btnAddStudents, "cell 2 10");
		
		panel_3 = new JPanel();
		getContentPane().add(panel_3, "cell 0 1,grow");
		
		JScrollPane scrollPane_2 = new JScrollPane();
		scrollPane_2.setPreferredSize(new Dimension(690, 290));
		panel_3.add(scrollPane_2);
		
		model_2 = new DefaultTableModel(tempTableArray,table_2ColumnNames);
		table_2 = new JTable(model_2);
		table_2.setPreferredScrollableViewportSize(new Dimension(700, 300));
		scrollPane_2.setViewportView(table_2);
		
		JPanel panel_4 = new JPanel();
		getContentPane().add(panel_4, "cell 1 1,grow");
		
	}

	@Override
	public void actionPerformed(ActionEvent e) 
	{
		Object pressed = e.getSource();
		if(pressed == btnImportStudentList)
		{
			JFileChooser chooser = new JFileChooser(schoolPath+"\\Database");
			int returnVal = chooser.showDialog(null, "Verify List");
			if(returnVal==JFileChooser.APPROVE_OPTION)
			{
				importStudents= new ImportStudentData(chooser.getSelectedFile().getAbsolutePath());
				
				tempTableArray=importStudents.toArray();
				model_1 = new DefaultTableModel(tempTableArray,table_1ColumnNames);
				table_1 = new JTable(model_1);
				table_1.setPreferredScrollableViewportSize(new Dimension(700, 300));
				panel_1.removeAll();
				
				scrollPane_1 = new JScrollPane(table_1);
				panel_1.add(scrollPane_1);
				panel_1.updateUI();
			}
		}
			

		if(pressed == btnPreviewInput)
		{
			try{
				importStudents.setColumnOrder(chckbxIncludeHeader.isSelected(), textField.getText(), textField_1.getText(),
						textField_2.getText(), textField_4.getText(), textField_5.getText(),
						textField_6.getText(), textField_7.getText(), textField_8.getText(), comboBox.getSelectedIndex());
			
			model_2 = new DefaultTableModel(importStudents.table2toArray(),table_2ColumnNames);
			table_2 = new JTable(model_2);
			table_2.setPreferredScrollableViewportSize(new Dimension(700, 300));
			
			panel_3.removeAll();
			scrollPane_2 = new JScrollPane(table_2);
			panel_3.add(scrollPane_2);
			panel_3.updateUI();
			previewed = true;
			}catch(Exception err){JOptionPane.showMessageDialog(null, "Error: "+err);}
		}
		if(pressed == btnAddStudents)
		{
			if(!previewed) JOptionPane.showMessageDialog(null, "Need to Preview First.");
			else
			{
					new DataVerification(students, importStudents.getStudentsToAdd(),studentGUI);
					this.dispose();
			}
		}
		
	}

}
