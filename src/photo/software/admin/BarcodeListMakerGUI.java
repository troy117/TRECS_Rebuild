package photo.software.admin;

import java.awt.Image;

import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JLabel;

import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.ImageIcon;
import javax.swing.JComboBox;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.JPanel;

import photo.software.student.Students;

@SuppressWarnings("serial")
public class BarcodeListMakerGUI extends JInternalFrame {
	private JTextField textField;
	private JComboBox<String> comboBox;
	private ArrayList<String> studentLists;
	private JPanel panel;
	private JLabel imageLabel, studentName;
	private File imageFile;
	private BufferedImage stuImage;
	private String schoolPath;
	private Students students;

	/**
	 * Create the frame.
	 */
	public BarcodeListMakerGUI(Students students, String schoolPath) 
	{
		this.students = students;
		studentLists = students.getListNames();
		this.schoolPath = schoolPath;
		Collections.sort(studentLists);
		
		
		setBounds(100, 100, 600, 501);
		getContentPane().setLayout(new MigLayout("", "[230.00][grow]", "[][][][][][][][grow][]"));
		this.setClosable(true);
		this.setVisible(true);
		
		JLabel lblBarcodeListMaker = new JLabel("Barcode List Maker");
		lblBarcodeListMaker.setFont(new Font("Tahoma", Font.PLAIN, 20));
		getContentPane().add(lblBarcodeListMaker, "cell 0 0,alignx center");
		
		panel = new JPanel();
		getContentPane().add(panel, "cell 1 0 1 8,grow");
		
		
		JLabel lblListName = new JLabel("List Name:");
		lblListName.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblListName, "cell 0 2,alignx center");
		
		comboBox = new JComboBox<String>();
		comboBox.addItem("");
		for(String s:studentLists) comboBox.addItem(s);
		comboBox.setEditable(true);
		comboBox.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(comboBox, "cell 0 3,growx");
		
		JLabel lblBarcode = new JLabel("Barcode:");
		lblBarcode.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblBarcode, "cell 0 5,alignx center");
		
		textField = new JTextField();
		textField.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent arg0) {
				addToList(textField.getText());
				textField.requestFocusInWindow();
				textField.selectAll();
			}
		});
		textField.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField, "cell 0 6,growx");
		textField.setColumns(10);
		
		studentName = new JLabel("NAME");
		studentName.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(studentName, "cell 1 8,alignx center");

	}
	private void addToList(String referenceNumber)
	{
		panel.removeAll();
		studentName.setText(students.getStudent(referenceNumber).first+" "+students.getStudent(referenceNumber).last);
		
		imageFile = new File(schoolPath+"\\CroppedMed\\"+referenceNumber+".jpg");
		if(imageFile.exists())
		{
			try 
			{
				stuImage = ImageIO.read(imageFile);
				imageLabel = new JLabel(new ImageIcon(stuImage.getScaledInstance(340, -1, Image.SCALE_FAST)));
				panel.add(imageLabel);
				stuImage.flush();
				stuImage = null;
			} catch (Exception e) {JOptionPane.showMessageDialog(null, "Error Displaying: "+referenceNumber+".jpg\nError: "+e);	}
		}
		students.addStudentToList((String)comboBox.getSelectedItem(), referenceNumber, false);
	}

}
