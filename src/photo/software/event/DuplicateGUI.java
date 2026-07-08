package photo.software.event;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;

import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.JComboBox;
import javax.swing.JButton;
import javax.swing.text.AbstractDocument;

import photo.software.league.LeagueGUI;
import photo.software.league.LeaguePlayer;

@SuppressWarnings("serial")
public class DuplicateGUI extends JInternalFrame implements ActionListener{
	private JTextField textField, textField_1, textField_2;
	private JComboBox<String> comboBox;
	private JButton btnAddNewRecord,btnAddNewRecord_1;
	private String image;
	private EventGUI event;
	private LeagueGUI league;

	public DuplicateGUI(ArrayList<String> homerooms,String image, EventGUI event) {
		this.image = image;
		this.event = event;
		this.league = null;
		UpcaseFilter upper = new UpcaseFilter();
		setBounds(100, 100, 490, 300);
		getContentPane().setLayout(new MigLayout("", "[][][82.00][]", "[][][][][][][][]"));
		
		JLabel lblAddNewReference = new JLabel("Add New Reference For Image: "+image);
		getContentPane().add(lblAddNewReference, "cell 0 0 4 1");
		
		textField = new JTextField();
		((AbstractDocument) textField.getDocument()).setDocumentFilter(upper);
		getContentPane().add(textField, "cell 0 2,growx");
		textField.setColumns(10);
		
		textField_1 = new JTextField();
		((AbstractDocument) textField_1.getDocument()).setDocumentFilter(upper);
		getContentPane().add(textField_1, "cell 1 2,growx");
		textField_1.setColumns(10);
		
		comboBox = new JComboBox<String> ();
		((AbstractDocument) ((JTextField) comboBox.getEditor().getEditorComponent()).getDocument()).setDocumentFilter(upper);
		for(String h:homerooms) comboBox.addItem(h);
		comboBox.setEditable(true);
		getContentPane().add(comboBox, "cell 2 2,growx");
		
		textField_2 = new JTextField();
		((AbstractDocument) textField_2.getDocument()).setDocumentFilter(upper);
		getContentPane().add(textField_2, "cell 3 2,growx");
		textField_2.setColumns(10);
		
		JLabel lblFirst = new JLabel("First");
		getContentPane().add(lblFirst, "cell 0 3,alignx center,aligny top");
		
		JLabel lblLast = new JLabel("Last");
		getContentPane().add(lblLast, "cell 1 3,alignx center,aligny top");
		
		JLabel lblHomeroom = new JLabel("Homeroom");
		getContentPane().add(lblHomeroom, "cell 2 3,alignx center,aligny top");
		
		JLabel lblOrder = new JLabel("Order");
		getContentPane().add(lblOrder, "cell 3 3,alignx center");
		
		JLabel lblIfYouWant = new JLabel("If you want to add one record for image");
		getContentPane().add(lblIfYouWant, "cell 0 6 2 1");
		
		btnAddNewRecord = new JButton("Add New Record");
		btnAddNewRecord.addActionListener(this);
		getContentPane().add(btnAddNewRecord, "cell 2 6,growx");
		
		JLabel lblIfYouWant_1 = new JLabel("If you want to add multiple records:");
		getContentPane().add(lblIfYouWant_1, "cell 0 7 2 1");
		
		btnAddNewRecord_1 = new JButton("Add New Record & Clear");
		btnAddNewRecord_1.addActionListener(this);
		getContentPane().add(btnAddNewRecord_1, "cell 2 7");
		
		this.setVisible(true);
		this.setClosable(true);
		this.setDefaultCloseOperation(DISPOSE_ON_CLOSE);

	}

	public DuplicateGUI(ArrayList<String> teams,String image, LeagueGUI league) {
		this.image = image;
		this.league = league;
		this.event = null;
		UpcaseFilter upper = new UpcaseFilter();
		setBounds(100, 100, 490, 300);
		getContentPane().setLayout(new MigLayout("", "[][][82.00][]", "[][][][][][][][]"));
		
		JLabel lblAddNewReference = new JLabel("Add New Reference For Image: "+image);
		getContentPane().add(lblAddNewReference, "cell 0 0 4 1");
		
		textField = new JTextField();
		((AbstractDocument) textField.getDocument()).setDocumentFilter(upper);
		getContentPane().add(textField, "cell 0 2,growx");
		textField.setColumns(10);
		
		textField_1 = new JTextField();
		((AbstractDocument) textField_1.getDocument()).setDocumentFilter(upper);
		getContentPane().add(textField_1, "cell 1 2,growx");
		textField_1.setColumns(10);
		
		comboBox = new JComboBox<String> ();
		((AbstractDocument) ((JTextField) comboBox.getEditor().getEditorComponent()).getDocument()).setDocumentFilter(upper);
		for(String t:teams) comboBox.addItem(t);
		comboBox.setEditable(true);
		getContentPane().add(comboBox, "cell 2 2,growx");
		
		textField_2 = new JTextField();
		((AbstractDocument) textField_2.getDocument()).setDocumentFilter(upper);
		getContentPane().add(textField_2, "cell 3 2,growx");
		textField_2.setColumns(10);
		
		JLabel lblFirst = new JLabel("Name1");
		getContentPane().add(lblFirst, "cell 0 3,alignx center,aligny top");
		
		JLabel lblLast = new JLabel("Name2");
		getContentPane().add(lblLast, "cell 1 3,alignx center,aligny top");
		
		JLabel lblHomeroom = new JLabel("Team");
		getContentPane().add(lblHomeroom, "cell 2 3,alignx center,aligny top");
		
		JLabel lblOrder = new JLabel("Order");
		getContentPane().add(lblOrder, "cell 3 3,alignx center");
		
		JLabel lblIfYouWant = new JLabel("If you want to add one record for image");
		getContentPane().add(lblIfYouWant, "cell 0 6 2 1");
		
		btnAddNewRecord = new JButton("Add New Record");
		btnAddNewRecord.addActionListener(this);
		getContentPane().add(btnAddNewRecord, "cell 2 6,growx");
		
		JLabel lblIfYouWant_1 = new JLabel("If you want to add multiple records:");
		getContentPane().add(lblIfYouWant_1, "cell 0 7 2 1");
		
		btnAddNewRecord_1 = new JButton("Add New Record & Clear");
		btnAddNewRecord_1.addActionListener(this);
		getContentPane().add(btnAddNewRecord_1, "cell 2 7");
		
		this.setVisible(true);
		this.setClosable(true);
		this.setDefaultCloseOperation(DISPOSE_ON_CLOSE);

	}
	@Override
	public void actionPerformed(ActionEvent arg0) {
		Object pressed = arg0.getSource();
		if(pressed == btnAddNewRecord)
		{
			if(event!=null && league==null)
			{
				EventStudent e = new EventStudent("",image,textField.getText().trim()
						,textField_1.getText().trim(),(String)comboBox.getSelectedItem(),textField_2.getText().trim(),"");
				event.addDuplicateImage(e);
				this.dispose();
			}
			else if(event==null && league!=null)
			{
				LeaguePlayer e = new LeaguePlayer("",image,textField.getText().trim()
						,textField_1.getText().trim(),(String)comboBox.getSelectedItem(),textField_2.getText().trim());
				league.addDuplicateImage(e);
				this.dispose();
			}
		}
		else if(pressed == btnAddNewRecord_1)
		{
			if(event!=null && league==null)
			{
				EventStudent e = new EventStudent("",image,textField.getText().trim()
						,textField_1.getText().trim(),(String)comboBox.getSelectedItem(),textField_2.getText().trim(),"");
				event.addDuplicateImage(e);
				textField.setText("");
				textField_1.setText("");
				textField_2.setText("");
				comboBox.setSelectedIndex(0);
			}
			else if(event==null && league!=null)
			{
				LeaguePlayer e = new LeaguePlayer("",image,textField.getText().trim()
						,textField_1.getText().trim(),(String)comboBox.getSelectedItem(),textField_2.getText().trim());
				league.addDuplicateImage(e);
				textField.setText("");
				textField_1.setText("");
				textField_2.setText("");
				comboBox.setSelectedIndex(0);
			}
		}
	}
}