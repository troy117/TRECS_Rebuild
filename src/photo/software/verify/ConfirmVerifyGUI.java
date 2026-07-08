package photo.software.verify;

import java.awt.Color;
import java.awt.Component;

import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTable;
import javax.swing.JScrollPane;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;

import java.awt.Dimension;

import javax.swing.JLabel;

import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;

import photo.tables.ExcelAdapter;


@SuppressWarnings("serial")
public class ConfirmVerifyGUI extends JInternalFrame implements ActionListener
{
	
	private JPanel panel,panel_1,panel_2;
	private JScrollPane scrollPane;
	
	private JTable table,table_1,table_2;
	private DefaultTableModel model,model_1,model_2;
	private String[] tableColumnNames = {"Reference","Current Last","Current First",
								"Current ID","Current Grade","Current HR","New Last",
								"New First","New ID","New Grade","New HR"};
	private String[] tableColumnNames12 = {"Last","First","ID","Grade","Homeroom"};
	private String[][] tableArray, tableArray_1, tableArray_2;
	private JScrollPane scrollPane_1;
	private JScrollPane scrollPane_2;
	private JLabel lblStudentsNotIn;
	private JLabel lblStudentsNotIn_1;
	private JPanel panel_3;
	private JButton btnRemove;
	private JButton btnAccept;
	private DataVerification dataV;
	private JButton btnRemoveStudent;
	private JButton btnAddAllStudents;

	
	/**
	 * Create the frame.
	 */
	public ConfirmVerifyGUI(DataVerification dataV,String[][] tableArray, String[][] remainingList, String[][] remainingStudents) 
	{
		this.dataV=dataV;
		setMinimumSize(new Dimension(450, 400));
		setMaximumSize(new Dimension(900, 800));
		this.tableArray=tableArray;
		this.tableArray_1=remainingList;
		this.tableArray_2=remainingStudents;
		this.setVisible(true);
		this.setTitle("Confirm Verified Data");
		this.setClosable(true);
		
		
		setBounds(100, 100, 930, 840);
		getContentPane().setLayout(new MigLayout("", "[410.00][406.00][]", "[387.00][][367.00][]"));
		setResizable(true);
		
		panel = new JPanel();
		getContentPane().add(panel, "cell 0 0 2 1,alignx left,growy");
		buildTable();
		
		
		panel_3 = new JPanel();
		getContentPane().add(panel_3, "cell 2 0,grow");
		panel_3.setLayout(new MigLayout("", "[71px]", "[23px][][][][][][][][][][]"));
		
		btnRemove = new JButton("Remove");
		btnRemove.addActionListener(this);
		panel_3.add(btnRemove, "cell 0 7,alignx left,aligny top");
		
		btnAccept = new JButton("Accept");
		btnAccept.addActionListener(this);
		panel_3.add(btnAccept, "cell 0 10");
		
		
		
		//For Table_1
		panel_1 = new JPanel();
		getContentPane().add(panel_1, "cell 0 2,grow");
		
		lblStudentsNotIn = new JLabel("Students Not in Island Photo Program");
		getContentPane().add(lblStudentsNotIn, "cell 0 1");
		lblStudentsNotIn.setFont(new Font("Tahoma", Font.PLAIN, 16));
		
		btnRemoveStudent = new JButton("Remove Student");
		btnRemoveStudent.addActionListener(this);
		getContentPane().add(btnRemoveStudent, "flowx,cell 0 3");
		
		btnAddAllStudents = new JButton("Add All Students");
		btnAddAllStudents.addActionListener(this);
		getContentPane().add(btnAddAllStudents, "cell 0 3");
		//Table_1
		buildTable_1();
		
		
		//For Table_2
		panel_2 = new JPanel();
		getContentPane().add(panel_2, "cell 1 2,grow");
		
		lblStudentsNotIn_1 = new JLabel("Students Not in Updated List");
		getContentPane().add(lblStudentsNotIn_1, "cell 1 1");
		lblStudentsNotIn_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		
		//Table_2
		buildTable_2();

	}

	//Table
	private void buildTable()
	{

		scrollPane = new JScrollPane();
		panel.add(scrollPane);
		
		
		model = new DefaultTableModel(this.tableArray,tableColumnNames){
			public boolean isCellEditable(int row, int col){
				return false;
			}
		};
		//Identifies differences in data in pink
		table = new JTable(model){
			 
			   @Override
			   public Component prepareRenderer(TableCellRenderer renderer,
			         int row, int column) 
			   {
			      JLabel label = (JLabel) super.prepareRenderer(renderer, row, column);
			      //Last Name
			      
			      if (table.getSelectedRow()==row) label.setBackground(Color.LIGHT_GRAY);
			      else if ((column == 1||column==6)&&(!super.getValueAt(row,1).equals(super.getValueAt(row,6))))
			         label.setBackground(Color.PINK);
			      //First Name
			      else if ((column == 2||column==7)&&(!super.getValueAt(row,2).equals(super.getValueAt(row,7))))
			         label.setBackground(Color.PINK);
			      //Grade
			      else if ((column == 4||column==9)&&(!super.getValueAt(row,4).equals(super.getValueAt(row,9))))
				         label.setBackground(Color.PINK);
			      //Homeroom
			      else if ((column == 5||column==10)&&(!super.getValueAt(row,5).equals(super.getValueAt(row,10))))
				         label.setBackground(Color.PINK);
			      else label.setBackground(Color.WHITE);
			     
			      
			      return label;
			   }
			   public Color getSelectionBackground(){
				   return Color.LIGHT_GRAY;
			   }
			};
		
		table.setPreferredScrollableViewportSize(new Dimension(800, 350));
		
		scrollPane.setViewportView(table);
	}
	public void removeStudentFromList()
	{
		int selected[] = table.getSelectedRows();
		if(selected.length!=0)
		{
			dataV.removeRow(selected[0]);
		}
	}
	public void updateTable(String[][] tableArray)
	{
		panel.removeAll();
		this.tableArray=tableArray;
		buildTable();
		panel.updateUI();
	}

	//Table_1
	public void buildTable_1()
	{
		model_1 = new DefaultTableModel(this.tableArray_1,tableColumnNames12){
			public boolean isCellEditable(int row, int col){
				return false;
			}
		};	
		panel_1.setLayout(new MigLayout("", "[384.00px]", "[327px]"));
		
		scrollPane_1 = new JScrollPane();
		panel_1.add(scrollPane_1, "cell 0 0,alignx center,aligny top");
		table_1 = new JTable(model_1);
		table_1.setPreferredScrollableViewportSize(new Dimension(375, 300));
		scrollPane_1.setViewportView(table_1);
	}
	public void removeStudentFromTable_1(Boolean removeAll)
	{
		int selected[] = table_1.getSelectedRows();
		if((!removeAll)&&(selected.length!=0))
		{
			dataV.removeRemVer(selected[0],removeAll);
		}
		else if(removeAll)
		{
			dataV.removeRemVer(0, removeAll);
		}
	}
	public void updateTable_1(String[][] tableArray_1)
	{
		panel_1.removeAll();
		this.tableArray_1=tableArray_1;
		buildTable_1();
		panel_1.updateUI();
	}
	
	//Table_2
	private void buildTable_2()
	{
		model_2 = new DefaultTableModel(this.tableArray_2,tableColumnNames12){
			public boolean isCellEditable(int row, int col){
				return false;
			}
		};	
		panel_2.setLayout(new MigLayout("", "[377px,grow]", "[327px]"));
		
		scrollPane_2 = new JScrollPane();
		panel_2.add(scrollPane_2, "cell 0 0,alignx center,aligny top");
		table_2 = new JTable(model_2);
		table_2.setPreferredScrollableViewportSize(new Dimension(375, 300));
		scrollPane_2.setViewportView(table_2);
		@SuppressWarnings("unused")
		ExcelAdapter myAd = new ExcelAdapter(table_2);
	}

	public void actionPerformed(ActionEvent e) 
	{
		Object pressed=e.getSource();
		if(pressed==btnRemove)
		{
			removeStudentFromList();
		}
		else if(pressed==btnRemoveStudent)
		{
			removeStudentFromTable_1(false);
		}
		else if(pressed==btnAddAllStudents)
		{
			dataV.addRemVer();
			removeStudentFromTable_1(true);
		}
		else if(pressed==btnAccept)
		{
			Object[] options = {"Yes","NO"};
			int n = JOptionPane.showOptionDialog(null, "Have you made all the changes necessary?\n"
					+ "Hitting Yes will exit out of this window", "Confirm Changes", JOptionPane.YES_NO_OPTION, 
					JOptionPane.QUESTION_MESSAGE, null, options, options[1]);
			if(n==JOptionPane.YES_OPTION) dataV.saveChanges();
			
		}
	}

}
