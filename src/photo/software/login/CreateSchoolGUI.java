package photo.software.login;


import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import org.eclipse.wb.swing.FocusTraversalOnArray;

import java.awt.Font;
import java.awt.Toolkit;
import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.ScrollPaneConstants;
import javax.swing.JTextPane;
import javax.swing.JScrollPane;
import javax.swing.JButton;
import javax.swing.text.AbstractDocument;
import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;
import javax.swing.text.DefaultStyledDocument;
import javax.swing.text.DocumentFilter;

@SuppressWarnings("serial")
public class CreateSchoolGUI extends JInternalFrame {
	private JTextField textField, textField_0, textField_2, textField_3, textField_4, textField_5, textField_6, 
				textField_7, textField_8, textField_9, textField_10, textField_11, textField_12, textField_13, 
				textField_14, textField_15, textField_1;
	private JTextPane textPane;
	private CreateNewJobGUI gui;
	private ProgramData programData;

	public CreateSchoolGUI(CreateNewJobGUI gui, DesktopWindow window) 
	{
		this.gui = gui;
		programData = window.programData;
		initialize();
	}
	public void initialize()
	{
		UpcaseFilter upper = new UpcaseFilter()
		{
			public void insertString(DocumentFilter.FilterBypass fb, int offset,
			      String text, AttributeSet attr) throws BadLocationException {
			    fb.insertString(offset, text.toUpperCase(), attr);
			  }

			  //no need to override remove(): inherited version allows all removals

			  public void replace(DocumentFilter.FilterBypass fb, int offset, int length,
			      String text, AttributeSet attr) throws BadLocationException {
			    fb.replace(offset, length, text.toUpperCase(), attr);
			  }
		};
		setBounds(100, 100, 750, 799);
		getContentPane().setLayout(new MigLayout("", "[130.00][591.00,grow]", "[70.00][][][][][][][][][][][][][][][][][140.00][][]"));
		
		JLabel lblNewSchoolInformation = new JLabel("NEW SCHOOL INFORMATION");
		lblNewSchoolInformation.setFont(new Font("Tahoma", Font.BOLD, 30));
		getContentPane().add(lblNewSchoolInformation, "cell 0 0 2 1,alignx center");
		
		JLabel lblSchoolName = new JLabel("School Name:");
		lblSchoolName.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblSchoolName, "cell 0 1,alignx trailing");
		
		textField = new JTextField();
		((AbstractDocument) textField.getDocument()).setDocumentFilter(upper);
		textField.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField, "cell 1 1,growx");
		textField.setColumns(10);
		
		JLabel lblTrecsName = new JLabel("TRECS Name:");
		lblTrecsName.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblTrecsName, "cell 0 2,alignx trailing");
		
		textField_0 = new JTextField();
		((AbstractDocument) textField_0.getDocument()).setDocumentFilter(upper);
		textField_0.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField_0, "cell 1 2,growx");
		textField_0.setColumns(10);
		
		JLabel lblPhone = new JLabel("Phone:");
		lblPhone.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblPhone, "cell 0 4,alignx trailing");
		
		textField_1 = new JTextField();
		((AbstractDocument) textField_1.getDocument()).setDocumentFilter(upper);
		textField_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField_1, "cell 1 4,growx");
		textField_1.setColumns(10);
		
		JLabel lblAddress = new JLabel("Address:");
		lblAddress.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblAddress, "cell 0 5,alignx trailing");
		
		textField_2 = new JTextField();
		((AbstractDocument) textField_2.getDocument()).setDocumentFilter(upper);
		textField_2.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField_2, "cell 1 5,growx");
		textField_2.setColumns(10);
		
		JLabel lblCity = new JLabel("City:");
		lblCity.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblCity, "cell 0 6,alignx trailing");
		
		textField_3 = new JTextField();
		((AbstractDocument) textField_3.getDocument()).setDocumentFilter(upper);
		textField_3.setFont(new Font("Dialog", Font.PLAIN, 16));
		getContentPane().add(textField_3, "flowx,cell 1 6,growx");
		textField_3.setColumns(10);
		
		JLabel lblState = new JLabel("State:");
		lblState.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblState, "cell 1 6,alignx trailing");
		
		textField_4 = new JTextField();
		((AbstractDocument) textField_4.getDocument()).setDocumentFilter(upper);
		textField_4.setFont(new Font("Dialog", Font.PLAIN, 16));
		textField_4.setText("CA");
		getContentPane().add(textField_4, "cell 1 6,alignx left");
		textField_4.setColumns(10);
		
		JLabel lblZipcode = new JLabel("Zipcode:");
		lblZipcode.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblZipcode, "cell 1 6,alignx trailing");
		
		textField_5 = new JTextField();
		((AbstractDocument) textField_5.getDocument()).setDocumentFilter(upper);
		textField_5.setFont(new Font("Dialog", Font.PLAIN, 16));
		getContentPane().add(textField_5, "cell 1 6");
		textField_5.setColumns(10);
		
		JLabel lblContactName = new JLabel("Contact 1 Name:");
		lblContactName.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblContactName, "cell 0 8,alignx trailing");
		
		textField_6 = new JTextField();
		((AbstractDocument) textField_6.getDocument()).setDocumentFilter(upper);
		textField_6.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField_6, "flowx,cell 1 8,growx");
		textField_6.setColumns(10);
		
		JLabel lblContactPosition = new JLabel("Contact 1 Position:");
		lblContactPosition.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblContactPosition, "cell 1 8,alignx trailing");
		
		textField_7 = new JTextField();
		((AbstractDocument) textField_7.getDocument()).setDocumentFilter(upper);
		textField_7.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField_7, "cell 1 8,growx");
		textField_7.setColumns(10);
		
		JLabel lblContactEmail = new JLabel("Contact 1 Email:");
		lblContactEmail.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblContactEmail, "cell 0 9,alignx trailing");
		
		textField_8 = new JTextField();
		((AbstractDocument) textField_8.getDocument()).setDocumentFilter(upper);
		textField_8.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField_8, "cell 1 9,growx");
		textField_8.setColumns(10);
		
		JLabel lblContactName_1 = new JLabel("Contact 2 Name:");
		lblContactName_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblContactName_1, "cell 0 11,alignx trailing");
		
		textField_9 = new JTextField();
		((AbstractDocument) textField_9.getDocument()).setDocumentFilter(upper);
		textField_9.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField_9, "flowx,cell 1 11,growx");
		textField_9.setColumns(10);
		
		JLabel lblContactPosition_1 = new JLabel("Contact 2 Position:");
		lblContactPosition_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblContactPosition_1, "cell 1 11,alignx trailing");
		
		textField_10 = new JTextField();
		((AbstractDocument) textField_10.getDocument()).setDocumentFilter(upper);
		textField_10.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField_10, "cell 1 11,growx");
		textField_10.setColumns(10);
		
		JLabel lblContactEmail_1 = new JLabel("Contact 2 Email:");
		lblContactEmail_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblContactEmail_1, "cell 0 12,alignx trailing");
		
		textField_11 = new JTextField();
		((AbstractDocument) textField_11.getDocument()).setDocumentFilter(upper);
		textField_11.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField_11, "cell 1 12,growx");
		textField_11.setColumns(10);
		
		JLabel lblContactName_2 = new JLabel("Contact 3 Name:");
		lblContactName_2.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblContactName_2, "cell 0 14,alignx trailing");
		
		textField_12 = new JTextField();
		((AbstractDocument) textField_12.getDocument()).setDocumentFilter(upper);
		textField_12.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField_12, "flowx,cell 1 14,growx");
		textField_12.setColumns(10);
		
		JLabel lblContactPosition_2 = new JLabel("Contact 3 Position:");
		lblContactPosition_2.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblContactPosition_2, "cell 1 14,alignx trailing");

		textField_13 = new JTextField();
		((AbstractDocument) textField_13.getDocument()).setDocumentFilter(upper);
		textField_13.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField_13, "cell 1 14,growx");
		textField_13.setColumns(10);
		
		JLabel lblContactEmail_2 = new JLabel("Contact 3 Email:");
		lblContactEmail_2.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblContactEmail_2, "cell 0 15,alignx trailing");
		
		textField_14 = new JTextField();
		((AbstractDocument) textField_14.getDocument()).setDocumentFilter(upper);
		textField_14.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField_14, "cell 1 15,growx");
		textField_14.setColumns(10);
		
		JLabel lblNotes = new JLabel("Notes:");
		lblNotes.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblNotes, "cell 0 17,alignx right");
		
		JScrollPane scrollPane = new JScrollPane();
		scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
		getContentPane().add(scrollPane, "cell 1 17,grow");
		
		textPane = new JTextPane(new DefaultStyledDocument(){
			public void insertString(int offs, String str, AttributeSet a) throws BadLocationException
			{
				if((getLength() + str.length()) <= 255) {super.insertString(offs, str, a);}
			    else Toolkit.getDefaultToolkit().beep();
			}
		});
		
		textPane.setFont(new Font("Tahoma", Font.PLAIN, 16));
		scrollPane.setViewportView(textPane);
		
		JLabel lblLastYearsReference = new JLabel("Last Years Reference #:");
		lblLastYearsReference.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblLastYearsReference, "cell 0 18,alignx trailing");
		
		textField_15 = new JTextField();
		textField_15.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField_15, "cell 1 18,growx");
		textField_15.setColumns(10);
		
		JButton btnAddSchool = new JButton("Add School");
		btnAddSchool.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent arg0) {
				SchoolData addSchool = new SchoolData(textField_15.getText(),textField.getText(),textField_0.getText(),textField_1.getText(),
						textField_2.getText(),textField_3.getText(), textField_4.getText(), textField_5.getText(), textField_6.getText(),textField_7.getText(),
						textField_8.getText(), textField_9.getText(),textField_10.getText(),textField_11.getText(), textField_12.getText(), textField_13.getText(),
						textField_14.getText(), textPane.getText());
				if(programData.addSchool(addSchool))
				{
					gui.successAddingSchool();
					dispose();
				}
				else
				{
					JOptionPane.showMessageDialog(null, "Error Adding School!");
				}
			}});
		btnAddSchool.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(btnAddSchool, "cell 1 19");

		getContentPane().setFocusTraversalPolicy(new FocusTraversalOnArray(new Component[]{lblSchoolName, textField, lblTrecsName, textField_0, lblPhone, textField_1, lblAddress, textField_2, lblCity, textField_3, lblState, textField_4, lblZipcode, textField_5, lblContactName, textField_6, lblContactPosition, textField_7, lblContactEmail, textField_8, lblContactName_1, textField_9, lblContactPosition_1, textField_11, lblContactEmail_1, textField_10, lblContactName_2, textField_12, lblContactPosition_2, textField_13, lblContactEmail_2, textField_14, lblNotes, textPane, scrollPane, lblLastYearsReference, textField_15, btnAddSchool, lblNewSchoolInformation}));
		this.setDefaultCloseOperation(DISPOSE_ON_CLOSE);
		this.setClosable(true);
		this.setVisible(true);
	}
	public void dispose()
	{
		super.dispose();
	}
}


