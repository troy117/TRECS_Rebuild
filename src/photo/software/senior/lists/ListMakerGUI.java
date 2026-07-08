package photo.software.senior.lists;

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
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JButton;
import javax.swing.table.DefaultTableModel;
import javax.swing.JTextField;

import photo.software.comparators.*;
import photo.software.senior.Senior;
import photo.software.senior.Seniors;
import photo.tables.ExcelAdapter;

import javax.swing.JCheckBox;


@SuppressWarnings("serial")
public class ListMakerGUI extends JInternalFrame implements ActionListener
{
	
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
	private Seniors studentData;
	private ArrayList<ListItem> list;
	private JButton button, button_1;
	JScrollPane scrollPane_1;
	JPanel panel_3,panel_4;
	private JTextField textField;
	private JButton btnAddList;
	private JScrollPane scrollPane;
	private ArrayList<Senior> seniors;
	@SuppressWarnings("unused")
	private ExcelAdapter myAd;
	private JButton btnBrowseForList;
	private JCheckBox chckbxExclusiveListaddNames;
	private JLabel lblColId;
	private JButton btnListReport;

	/**
	 * Create the frame.
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public ListMakerGUI(Seniors data, String schoolName) 
	{
		this.studentData = data;
		seniors = studentData.getSeniors();
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
		
		tempTableArray_1 = new ListMaker(seniors).toTableArray();
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
				//generateListReport();
				//writeExcel(fc.getSelectedFile().getAbsolutePath());
			}	
		}
		if(pressed == btnAddList)
		{
			addList();
			//new Logger(schoolPath,"New list created: "+textField.getText()+".");
		}
		if(pressed == comboBox_1)
		{
			Collections.sort(seniors, new SeniorReferenceSortComparator());

			tempTableArray_1 = new ListMaker(seniors).toTableArray();
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
				
				//openExcel(fc.getSelectedFile());
			}		
		}
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
				studentData.addSeniorToList(comboBox.getSelectedItem().toString(),
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
		ArrayList<Senior> table2list = new ArrayList<Senior>();
		for(ListItem l:list)
		{
			if(l.getList().equals(comboBox.getSelectedItem()))
			{
				table2list.add(l.getSenior());
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
