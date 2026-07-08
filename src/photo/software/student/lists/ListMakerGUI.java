package photo.software.student.lists;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JComboBox;
import javax.swing.JTable;
import javax.swing.JScrollPane;

import java.awt.Dimension;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JButton;
import javax.swing.table.DefaultTableModel;
import javax.swing.JTextField;

import photo.software.comparators.*;
import photo.software.composites.Homeroom;
import photo.software.student.Student;
import photo.software.student.Students;
import photo.tables.ExcelAdapter;

import javax.swing.JCheckBox;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


@SuppressWarnings("serial")
public class ListMakerGUI extends JInternalFrame implements ActionListener
{
	private String[] rowValues;
	public static final int COLUMN = 2;
	NumberFormat formatter = new DecimalFormat("############");
	int[] counts = new int[16];
	String[] grades = new String[16];
	private JTable table_1,table_2;
	private DefaultTableModel model_1, model_2;
	private String[][] tempTableArray_1=null,tempTableArray_2 = null;
	private String[] tableHeader = {"Ref","Last","First","Grade","ID","Homeroom"};
	@SuppressWarnings("rawtypes")
	private JComboBox comboBox,comboBox_1;
	private Students studentData;
	private ArrayList<ListItem> list;
	private JButton button, button_1;
	JScrollPane scrollPane_1;
	JPanel panel_3,panel_4;
	private JTextField textField;
	private JButton btnAddList;
	private JScrollPane scrollPane;
	private ArrayList<Student> students;
	@SuppressWarnings("unused")
	private ExcelAdapter myAd;
	private JButton btnBrowseForList;
	private JCheckBox chckbxExclusiveListaddNames;
	private JLabel lblColId;
	private JButton btnListReport;
	private ArrayList<Homeroom> homerooms;
	private String schoolName;

	/**
	 * Create the frame.
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public ListMakerGUI(Students data, String schoolName) 
	{
		this.studentData = data;
		this.schoolName = schoolName;
		students = studentData.getStudents();
		list = new ArrayList<ListItem>();
		
		this.setVisible(true);
		this.setClosable(true);
		setBounds(100, 100, 1100, 700);
		getContentPane().setLayout(new MigLayout("", "[525.00][50.00][525.00]", "[97.00][62.00][30.00][30.00][][]"));
		
		JPanel panel_1 = new JPanel();
		getContentPane().add(panel_1, "cell 0 0,grow");
		panel_1.setLayout(new MigLayout("", "[][201.00][84.00][][]", "[][][][]"));
		
		JLabel lblStudentList = new JLabel("Student List:");
		panel_1.add(lblStudentList, "cell 1 0");
		
		comboBox = new JComboBox();
		comboBox.addItem("");
		comboBox.addActionListener(this);
		panel_1.add(comboBox, "cell 1 1 2 1,growx");
		
		btnBrowseForList = new JButton("Browse for List");
		btnBrowseForList.addActionListener(this);
		panel_1.add(btnBrowseForList, "flowx,cell 4 1");
		
		textField = new JTextField();
		panel_1.add(textField, "cell 1 2,growx");
		textField.setColumns(10);
		
		btnAddList = new JButton("Add List");
		btnAddList.addActionListener(this);
		panel_1.add(btnAddList, "cell 2 2");
		
		chckbxExclusiveListaddNames = new JCheckBox("Exclusive List,(Add Names not on List)");
		panel_1.add(chckbxExclusiveListaddNames, "cell 4 2");
		
		lblColId = new JLabel("Col1 ID, Col2 List");
		panel_1.add(lblColId, "cell 4 1");
		
		btnListReport = new JButton("List Report");
		btnListReport.addActionListener(this);
		panel_1.add(btnListReport, "cell 4 3");
		
		JPanel panel_2 = new JPanel();
		getContentPane().add(panel_2, "cell 2 0,grow");
		
		panel_3 = new JPanel();
		getContentPane().add(panel_3, "cell 0 1 1 4,grow");
		
		scrollPane = new JScrollPane();
		panel_3.add(scrollPane);
		
		tempTableArray_1 = new ListMaker(students).toTableArray();
		model_1 = new DefaultTableModel(tempTableArray_1,tableHeader){
			@Override
			public boolean isCellEditable(int row, int column){
				return false;
			}
		};
		table_1 = new JTable(model_1);
		table_1.setPreferredScrollableViewportSize(new Dimension(480, 480));
		scrollPane.setViewportView(table_1);
		panel_3.add(scrollPane);
		panel_3.updateUI();
		
		
		panel_4 = new JPanel();
		getContentPane().add(panel_4, "cell 2 1 1 4,grow");
		
		scrollPane_1 = new JScrollPane();
		panel_4.add(scrollPane_1);
		
		model_2 = new DefaultTableModel(tempTableArray_2,tableHeader){
			@Override
			public boolean isCellEditable(int row, int column){
				return false;
			}
		};;
		table_2 = new JTable(model_2);
		table_2.setPreferredSize(new Dimension(500, 0));
		table_2.setPreferredScrollableViewportSize(new Dimension(480, 480));
		scrollPane_1.setViewportView(table_2);
		myAd = new ExcelAdapter(table_2);
		
		button = new JButton("=>");
		button.addActionListener(this);
		getContentPane().add(button, "cell 1 2,alignx center");
		
		button_1 = new JButton("<=");
		button_1.addActionListener(this);
		getContentPane().add(button_1, "cell 1 3,alignx center");
		
		String[] sortStudents = {"ReferenceNumber","LastName","Grade","Homeroom"};
		comboBox_1 = new JComboBox(sortStudents);
		comboBox_1.addActionListener(this);
		getContentPane().add(comboBox_1, "cell 0 5,growx");
		updateLists();
		this.setVisible(true);
	}
	@SuppressWarnings("unchecked")
	private void updateLists()
	{
		comboBox.removeAllItems();
		comboBox.addItem("");
		studentData.loadListDatabase();
		ArrayList<String> listNames = new ArrayList<String>();
		for(ListItem l:studentData.getListItems())
		{
			if(!listNames.contains(l.getList()))
			{
				comboBox.addItem(l.getList());
				listNames.add(l.getList());
			}
		}
		list = studentData.getListItems();
	}
	public void actionPerformed(ActionEvent e) 
	{
		Object pressed = e.getSource();
		if(pressed == comboBox)	fillListTable();
		if(pressed == button) addStudentToList();
		if(pressed == button_1) removeStudentFromList();
		if(pressed == btnListReport && comboBox.getSelectedIndex()!=0)
		{
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int returnVal = fc.showOpenDialog(null);
			if(returnVal == JFileChooser.APPROVE_OPTION)
			{
				generateListReport();
				writeExcel(fc.getSelectedFile().getAbsolutePath());
			}	
		}
		if(pressed == btnAddList)
		{
			addList();
			//new Logger(schoolPath,"New list created: "+textField.getText()+".");
		}
		if(pressed == comboBox_1)
		{
			if(comboBox_1.getSelectedIndex()==0) Collections.sort(students, new StudentReferenceSortComparator());
			else if(comboBox_1.getSelectedIndex()==1) Collections.sort(students, new StudentLastNameSortComparator());
			else if(comboBox_1.getSelectedIndex()==2) Collections.sort(students, new StudentGradeSortComparator());
			else if(comboBox_1.getSelectedIndex()==3) Collections.sort(students, new StudentClassSortComparator());
			tempTableArray_1 = new ListMaker(students).toTableArray();
			model_1 = new DefaultTableModel(tempTableArray_1,tableHeader){
				@Override
				public boolean isCellEditable(int row, int column){
					return false;
				}
			};
			table_1 = new JTable(model_1);
			table_1.setPreferredScrollableViewportSize(new Dimension(480, 480));
			
			panel_3.removeAll();
			scrollPane = new JScrollPane(table_1);
			panel_3.add(scrollPane);
			panel_3.updateUI();
		}
		if(pressed == btnBrowseForList)
		{
			if(chckbxExclusiveListaddNames.isSelected()) JOptionPane.showMessageDialog(null, "This will create a list of "
					+"all the students whose ID numbers are not in the 1st column.\n"
					+"This list name will use the list selected in the comboBox.");
			JFileChooser fc = new JFileChooser();
			int returnVal = fc.showOpenDialog(null);
			if(returnVal == JFileChooser.APPROVE_OPTION)
			{
				
				openExcel(fc.getSelectedFile());
			}		
		}
	}
	private void generateListReport()
	{
		
		ArrayList<Student> selectedList = studentData.getStudentsFromList((String)comboBox.getSelectedItem());
		homerooms = new ArrayList<Homeroom>();
		for(int i=0;i<16;i++) counts[i]=0;
		grades[0] = "PRE";
		grades[1] = "TK";
		grades[2] = "KIN";
		grades[3] = "FAC";
		grades[4] = "01";
		grades[5] = "02";
		grades[6] = "03";
		grades[7] = "04";
		grades[8] = "05";
		grades[9] = "06";
		grades[10] = "07";
		grades[11] = "08";
		grades[12] = "09";
		grades[13] = "10";
		grades[14] = "11";
		grades[15] = "12";
		
		for(Student s: selectedList)
		{
			addToHomeroom(s);
			for(int i=0;i<16;i++)
			{
				if(s.grade.equals(grades[i]))
				{
					counts[i]++;
					break;
				}
			}
		}
	}
	private void addToHomeroom(Student s)
	{
		Boolean exists = false;
		for(Homeroom h: homerooms)
		{
			if(h.getHomeroom().equals(s.homeroom))
			{
				exists = true;
				h.addStudent(s);
				return;
			}
		}if(!exists)
		{
			homerooms.add(new Homeroom(s.homeroom));
			for(Homeroom h:homerooms)
			{
				if(h.getHomeroom().equals(s.homeroom)) h.addStudent(s);
			}
		}
	}
	private void writeExcel(String outputPath)
	{
		Workbook wb;
		Sheet sheet;
		Row row;
		try
		{
			wb = new XSSFWorkbook();
			sheet = wb.createSheet("Sheet1");
			int i=0;
			row = sheet.createRow(i);
			row.createCell(0).setCellValue("Grade:");
			row.createCell(1).setCellValue("Count:");
			row.createCell(3).setCellValue("Homeroom:");
			row.createCell(4).setCellValue("Count:");
			i++;
			row = sheet.createRow(i);
			for(int j=0;j<16||j<homerooms.size();j++)
			{
				if(j<16)
				{
					row.createCell(0).setCellValue(grades[j]);
					row.createCell(1).setCellValue(counts[j]);
				}
				if(j<homerooms.size())
				{
					row.createCell(3).setCellValue(homerooms.get(j).getHomeroom());
					row.createCell(4).setCellValue(homerooms.get(j).totalSize());
				}
				i++;
				row = sheet.createRow(i);
			}
			FileOutputStream fileOut = new FileOutputStream(outputPath+"\\"+schoolName+"_"+(String)comboBox.getSelectedItem()+".xlsx");
			wb.write(fileOut);
			fileOut.close();
			wb.close();
			
			
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error exporting listReport: "+e);}
	}
	private void openExcel(File f)
	{	
		ArrayList<Student> addList = new ArrayList<Student>();
		try
		{
			XSSFWorkbook wb = new XSSFWorkbook(new FileInputStream(f));
			XSSFSheet sheet = wb.getSheetAt(0);
			int rows = sheet.getPhysicalNumberOfRows();
			for (int r = 0; r < rows; r++) 
			{
				XSSFRow row = sheet.getRow(r);
				if (row == null) {
					continue;
				}
				rowValues = new String[COLUMN];
				for (int c = 0; c < COLUMN; c++) {
					XSSFCell cell = row.getCell(c);
					
					String value = null;
					try{
						switch (cell.getCellType()) {
							case XSSFCell.CELL_TYPE_FORMULA:
								value = "" + cell.getCellFormula();
								break;
		
							case XSSFCell.CELL_TYPE_NUMERIC:
								value = formatter.format(cell.getNumericCellValue());
								break;
		
							case XSSFCell.CELL_TYPE_STRING:
								value = "" + cell.getStringCellValue().toUpperCase();
								break;
							
							default:
							}
					}
					catch(NullPointerException e){value="";}
					if(value==null)value="";
					rowValues[c]=value.toUpperCase();
				}
				Boolean found = false;
				if((rowValues[0].equals(""))&&(rowValues[1].equals(""))) break;
				else
				{
					for(Student s: students)
					{
						if(rowValues[0].equals(s.ID))
						{
							rowValues[0] = s.ref;
							addList.add(s);
							found = true;
							break;
						}
					}
					if(found&&(!chckbxExclusiveListaddNames.isSelected())) studentData.addStudentToList(rowValues[1], rowValues[0], false);
				}
			}
			wb.close();
			if(chckbxExclusiveListaddNames.isSelected())
			{
				for(Student s:students)
				{
					if((!s.last.equals(""))&&(!s.first.equals(""))&&(!s.grade.equals("FAC")))
					{
						if(!addList.contains(s)&&(!comboBox.getSelectedItem().equals(""))) studentData.addStudentToList((String)comboBox.getSelectedItem(), s.ref, false);
					}
				}
			}
			JOptionPane.showMessageDialog(null,"SUCCESS!");
			
		}catch(Exception e){JOptionPane.showMessageDialog(null,"ERROR: "+e);}
		updateLists();
	}
	@SuppressWarnings("unchecked")
	public void addList()
	{
		if(!textField.getText().equals(""))
		{
			comboBox.addItem(textField.getText());
		}
		textField.setText("");
	}
	
	public void addStudentToList()
	{
		int selected[] = table_1.getSelectedRows();
		
		if((selected.length!=0)&&(!comboBox.getSelectedItem().equals("")))
		{
			for(int i=0;i<selected.length;i++)
			{
				studentData.addStudentToList(comboBox.getSelectedItem().toString(),
						tempTableArray_1[selected[i]][0], false);
			}
			list = studentData.getListItems();
			fillListTable();
		}
	}
	public void removeStudentFromList()
	{
		int selected[] = table_2.getSelectedRows();
		if(selected.length!=0)
		{
			for(int i=0;i<selected.length;i++)
			{
				studentData.removeStudentFromList(comboBox.getSelectedItem().toString(),
						tempTableArray_2[selected[i]][0]);
			}
			
			list = studentData.getListItems();
			fillListTable();
		}
	}
	public void fillListTable()
	{
		//comboBox.getSelectedItem();
		ArrayList<Student> table2list = new ArrayList<Student>();
		for(ListItem l:list)
		{
			if(l.getList().equals(comboBox.getSelectedItem()))
			{
				table2list.add(l.getStudent());
			}
		}
		tempTableArray_2 = new ListMaker(table2list).toTableArray();
		model_2 = new DefaultTableModel(tempTableArray_2,tableHeader){
			@Override
			public boolean isCellEditable(int row, int column){
				return false;
			}
		};
		table_2 = new JTable(model_2);
		table_2.setPreferredScrollableViewportSize(new Dimension(480, 480));
		myAd = new ExcelAdapter(table_2);
		panel_4.removeAll();
		scrollPane_1 = new JScrollPane(table_2);
		panel_4.add(scrollPane_1);
		panel_4.updateUI();
	}

}
