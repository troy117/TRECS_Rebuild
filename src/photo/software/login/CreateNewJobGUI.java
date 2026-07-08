package photo.software.login;

import net.miginfocom.swing.MigLayout;

import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JComboBox;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.JButton;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.InternalFrameListener;
import javax.swing.text.AbstractDocument;
import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;
import javax.swing.text.DocumentFilter;

import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.Collections;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;


@SuppressWarnings("serial")
public class CreateNewJobGUI extends JInternalFrame {
	private JTextField textField, textField_1;
	private JComboBox<String> comboBox, comboBox_1, comboBox_2, comboBox_3, comboBox_4;
	private DesktopWindow window;
	private ArrayList<JobData> jobs;
	private ArrayList<String> locations, plans, templates;
	private String[] type = {"FALL","EVENT","QREVENT","LEAGUE","SENIORS","SPRING","SPORTS"};
	JMenuItem mntmAddSchool;

	public CreateNewJobGUI(DesktopWindow window) 
	{
		this.window = window;
		jobs = window.programData.getJobs();
		locations = new ArrayList<String>();
		locations.add("");
		for(SchoolData school:window.programData.getSchools()) locations.add(school.trecsName);
		plans = new ArrayList<String>();
		templates = new ArrayList<String>();
		for(JobData j: jobs){if(!plans.contains(j.plan)) plans.add(j.plan);	}
		
		templates = window.programData.getIDtemplates();
		
		Collections.sort(plans);
		Collections.sort(locations);
		
		
		initialize();
	}
	private void addJob()
	{
		try{
			if(comboBox.getSelectedItem().equals("")) JOptionPane.showMessageDialog(null, "Need School.");
			else if(textField.getText().equals("")) JOptionPane.showMessageDialog(null, "Need Job Name.");
			else if(comboBox_2.getSelectedItem().equals("")) JOptionPane.showMessageDialog(null, "Need Package Plan.");
			else
			{
				JobData data = new JobData(jobs.size()+1+"",window.programData.getTrecsSchoolRef((String)comboBox.getSelectedItem()),comboBox.getSelectedItem().toString(),textField.getText(),
											comboBox_1.getSelectedItem().toString(),comboBox_2.getSelectedItem().toString(),comboBox_3.getSelectedItem().toString(),comboBox_4.getSelectedItem().toString(),
											textField_1.getText());
				if(window.programData.addJob(data)) close();
				else JOptionPane.showMessageDialog(null, "Error Adding new Job");
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error: "+e);}
	}
	private void close()
	{
		this.dispose();
		window.chooseJob();
	}
	public void successAddingSchool()
	{
		locations = new ArrayList<String>();
		locations.add("");
		for(SchoolData school:window.programData.getSchools()) locations.add(school.trecsName);
		Collections.sort(locations);
		comboBox.removeAllItems();
		for(String l:locations) comboBox.addItem(l);
	}
	private void addSchool()
	{
		window.add(new CreateSchoolGUI(this,window));
		this.moveToBack();

	}
	private void initialize()
	{
		UpcaseFilter upperCase = new UpcaseFilter();
		setBounds(100, 100, 600, 373);
		getContentPane().setLayout(new MigLayout("", "[][463.00,grow]", "[][][][][][][][][][]"));
		this.setClosable(true);
		this.setDefaultCloseOperation(DO_NOTHING_ON_CLOSE);
		this.addInternalFrameListener(new InternalFrameListener(){
			public void internalFrameClosing(InternalFrameEvent arg0) {
				close();
			}

			@Override
			public void internalFrameDeactivated(InternalFrameEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void internalFrameDeiconified(InternalFrameEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void internalFrameIconified(InternalFrameEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void internalFrameOpened(InternalFrameEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void internalFrameActivated(InternalFrameEvent e) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void internalFrameClosed(InternalFrameEvent e) {
				// TODO Auto-generated method stub
				
			}
			
		});
		JMenuBar menuBar = new JMenuBar();
		setJMenuBar(menuBar);
		
		mntmAddSchool = new JMenuItem("Add School");
		mntmAddSchool.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent arg0) {
				addSchool();
			}
		});
		menuBar.add(mntmAddSchool);
		
		JLabel lblAddANew = new JLabel("Add a new TRECS Job");
		lblAddANew.setFont(new Font("Tahoma", Font.PLAIN, 18));
		getContentPane().add(lblAddANew, "cell 0 0 2 1,alignx center");
		
		JLabel lblLocation = new JLabel("Location:");
		lblLocation.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblLocation, "cell 0 2,alignx trailing");
		
		comboBox = new JComboBox<String>();
		JTextField entry = (JTextField) comboBox.getEditor().getEditorComponent();
		((AbstractDocument) entry.getDocument()).setDocumentFilter(upperCase);
		
		comboBox.setEditable(false);
		for(String l:locations) comboBox.addItem(l);
		comboBox.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(comboBox, "cell 1 2,growx");
		
		JLabel lblJobName = new JLabel("Job Name:");
		lblJobName.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblJobName, "cell 0 3,alignx trailing");
		
		textField = new JTextField();
		((AbstractDocument) textField.getDocument()).setDocumentFilter(upperCase);
		textField.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField, "cell 1 3,growx");
		textField.setColumns(10);
		
		JLabel lblType = new JLabel("Type:");
		lblType.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblType, "cell 0 4,alignx trailing");
		
		comboBox_1 = new JComboBox<String>();
		for(String s:type) comboBox_1.addItem(s);
		comboBox_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(comboBox_1, "cell 1 4,growx");
		
		JLabel lblPackagePlan = new JLabel("Package Plan:");
		lblPackagePlan.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblPackagePlan, "cell 0 5,alignx trailing");
		
		comboBox_2 = new JComboBox<String>();
		JTextField entry1 = (JTextField) comboBox_2.getEditor().getEditorComponent();
		((AbstractDocument) entry1.getDocument()).setDocumentFilter(upperCase);
		comboBox_2.setEditable(true);
		for(String p:plans) comboBox_2.addItem(p);
		comboBox_2.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(comboBox_2, "cell 1 5,growx");
		
		JLabel lblIdTemplate = new JLabel("STU ID:");
		lblIdTemplate.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblIdTemplate, "cell 0 6,alignx trailing");
		
		comboBox_3 = new JComboBox<String>();
		JTextField entry2 = (JTextField) comboBox_3.getEditor().getEditorComponent();
		((AbstractDocument) entry2.getDocument()).setDocumentFilter(upperCase);
		comboBox_3.setEditable(true);
		for(String t:templates) comboBox_3.addItem(t);
		comboBox_3.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(comboBox_3, "cell 1 6,growx");
		
		JButton btnAdd = new JButton("Add");
		btnAdd.addActionListener(new ActionListener(){public void actionPerformed(ActionEvent arg0) {addJob();}});
		
		JLabel lblFacId = new JLabel("FAC ID:");
		lblFacId.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblFacId, "cell 0 7,alignx trailing");
		
		comboBox_4 = new JComboBox<String>();
		JTextField entry3 = (JTextField) comboBox_4.getEditor().getEditorComponent();
		((AbstractDocument) entry3.getDocument()).setDocumentFilter(upperCase);
		comboBox_4.setEditable(true);
		for(String t:templates) comboBox_4.addItem(t);
		comboBox_4.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(comboBox_4, "cell 1 7,growx");
		
		JLabel lblNotes = new JLabel("Notes:");
		lblNotes.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblNotes, "cell 0 8,alignx trailing");
		
		textField_1 = new JTextField();
		textField_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField_1, "cell 1 8,growx");
		textField_1.setColumns(10);
		btnAdd.setFont(new Font("Tahoma", Font.PLAIN, 16));
		
		getContentPane().add(btnAdd, "cell 1 9,growx");
		this.setVisible(true);
	}
}

class UpcaseFilter extends DocumentFilter{
	  public void insertString(DocumentFilter.FilterBypass fb, int offset,
		      String text, AttributeSet attr) throws BadLocationException {
		    fb.insertString(offset, text.toUpperCase(), attr);
		  }
		  public void replace(DocumentFilter.FilterBypass fb, int offset, int length,
		      String text, AttributeSet attr) throws BadLocationException {
		    fb.replace(offset, length, text.toUpperCase(), attr);
		  }
}

