package photo.software.admin;


import net.miginfocom.swing.MigLayout;

import javax.swing.JLabel;

import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JInternalFrame;
import javax.swing.JPanel;
import javax.swing.JSpinner;
import javax.swing.SpinnerNumberModel;
import javax.swing.JComboBox;
import javax.swing.DefaultComboBoxModel;

import photo.software.comparators.*;
import photo.software.student.Student;
import photo.software.student.Students;

import javax.swing.JCheckBox;

@SuppressWarnings("serial")
public class StickerGUI extends JInternalFrame implements ActionListener{

	//private JFrame frame;
	private JButton btnBrowse,btnCreateStickers;
	private JSpinner spinner;
	@SuppressWarnings("rawtypes")
	private JComboBox comboBox;
	private JPanel panel;
	private String imagesPath, outputPath;
	private Students students;
	private ArrayList<Student> renderStudents;
	private Boolean ready1;
	private JCheckBox chckbxPhotographedOnly;
	private JLabel label;
	private JLabel lblStudents;
	private JComboBox<String> comboBox_1;
	private JComboBox<String> comboBox_2;
	private JLabel lblList;
	ArrayList<String> listNames;

	/**
	 * @wbp.parser.constructor
	 */
	public StickerGUI(String schoolPath,Students students) {
		this.students = students;
		imagesPath=schoolPath+"//CroppedMed";
		outputPath="";
		ready1=false;
		initialize();
	}
	public StickerGUI(String schoolPath,Students students, String outputPath) {
		this.students = students;
		imagesPath=schoolPath+"//CroppedMed";
		this.outputPath = outputPath;
		ready1=true;
		initialize();
		btnBrowse.setVisible(false);
		label.setText(outputPath);
	}

	@SuppressWarnings({ "rawtypes", "unchecked", "removal" })
	private void initialize() {

		
		this.setVisible(true);
		this.setClosable(true);
		
		setBounds(100, 100, 450, 300);
		getContentPane().setLayout(new MigLayout("", "[425.00]", "[250.00]"));
		
		panel = new JPanel();
		getContentPane().add(panel, "cell 0 0,grow");
		panel.setLayout(new MigLayout("", "[][][200.00,grow]", "[][][][][][][][]"));
		
		lblStudents = new JLabel("Students:");
		lblStudents.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblStudents, "cell 1 1,alignx trailing");
		
		comboBox_1 = new JComboBox();
		comboBox_1.addItem("All Students");
		comboBox_1.addItem("List");
		comboBox_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		comboBox_1.addActionListener(this);
		panel.add(comboBox_1, "cell 2 1,growx");
		
		lblList = new JLabel("List:");
		lblList.setVisible(false);
		lblList.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblList, "cell 1 2,alignx trailing");
		
		comboBox_2 = new JComboBox();
		comboBox_2.setVisible(false);
		listNames = students.getListNames();
		for(String l:listNames) comboBox_2.addItem(l);
		comboBox_2.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(comboBox_2, "cell 2 2,growx");
		
		JLabel lblStickers = new JLabel("Stickers:");
		lblStickers.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblStickers, "cell 1 3,alignx right");
		
		label = new JLabel("");
		panel.add(label, "flowx,cell 2 3");
		
		btnCreateStickers = new JButton("Create Stickers");
		btnCreateStickers.addActionListener(this);
		
		btnBrowse = new JButton("Browse");
		btnBrowse.addActionListener(this);
		
		JLabel lblSort = new JLabel("Sort:");
		lblSort.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblSort, "cell 1 4,alignx right");
		
		comboBox = new JComboBox();
		comboBox.setFont(new Font("Tahoma", Font.PLAIN, 16));
		comboBox.setModel(new DefaultComboBoxModel(new String[] {"Alpha", "Alpha by Grade", "Alpha by Teacher"}));
		panel.add(comboBox, "cell 2 4,alignx left");
		
		JLabel lblOutput_1 = new JLabel("Output:");
		lblOutput_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblOutput_1, "cell 1 5,alignx right");
		btnBrowse.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(btnBrowse, "cell 2 5,alignx left");
		
		chckbxPhotographedOnly = new JCheckBox("Photographed Only");
		panel.add(chckbxPhotographedOnly, "cell 2 6");
		btnCreateStickers.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(btnCreateStickers, "cell 2 7,growx");
		
		spinner = new JSpinner();
		spinner.setFont(new Font("Tahoma", Font.PLAIN, 16));
		spinner.setModel(new SpinnerNumberModel(new Integer(3), new Integer(1), null, new Integer(1)));
		panel.add(spinner, "cell 2 3,alignx left");
		
	}
	private void updateComboBox()
	{
		if(comboBox_1.getSelectedIndex()==0)
		{
			lblList.setVisible(false);
			comboBox_2.setVisible(false);
		}
		else if(comboBox_1.getSelectedIndex()==1)
		{
			lblList.setVisible(true);
			comboBox_2.setVisible(true);
		}
	}

	@Override
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();

		if(pressed == btnBrowse)
		{
			JFileChooser j = new JFileChooser();
			j.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int returnVal = j.showOpenDialog(null);
			if(returnVal==JFileChooser.APPROVE_OPTION)
			{
				outputPath = j.getSelectedFile().getAbsolutePath();
				ready1=true;
			}
		}
		else if(pressed == comboBox_1)
		{
			updateComboBox();
		}
		else if((pressed == btnCreateStickers)&&ready1)
		{
			if(comboBox_1.getSelectedIndex()==0) renderStudents = students.getStudents();
			else renderStudents = students.getStudentsFromList((String)comboBox_2.getSelectedItem());
			
			if(comboBox.getSelectedIndex()==0) Collections.sort(renderStudents, new StudentLastNameSortComparator());
			else if(comboBox.getSelectedIndex()==1) Collections.sort(renderStudents, new StudentGradeSortComparator());
			else if(comboBox.getSelectedIndex()==2) Collections.sort(renderStudents, new StudentClassSortComparator());
			
			ArrayList<Student> renderList = new ArrayList<Student>();
			for(Student s:renderStudents)
			{
				if(!(((s.last.equals(""))&&s.first.equals(""))
						||(s.grade.equals("FAC"))||(s.grade.equals("EXMPT"))))
				{
					if(chckbxPhotographedOnly.isSelected())
					{
						if(s.photo.equals("true"))
						{
							for(int i=0;i<(Integer)spinner.getValue();i++)
							{
								renderList.add(s);
							}
						}
					}
					else
					{
						for(int i=0;i<(Integer)spinner.getValue();i++)
						{
							renderList.add(s);
						}
					}
				}
			}
			StickerBuilder stickers = new StickerBuilder(renderList,imagesPath,outputPath,
					comboBox.getSelectedIndex()==2,comboBox.getSelectedIndex()==1);
			stickers.beginProcess();
		}
	}

}
