package photo.software.spring;

import java.awt.Image;
import java.awt.Toolkit;

import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.ImageIcon;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.JCheckBox;
import javax.swing.JTextPane;
import javax.swing.JButton;
import javax.swing.JScrollPane;
import javax.swing.JPanel;
import javax.swing.ScrollPaneConstants;
import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;
import javax.swing.text.DefaultStyledDocument;

import photo.software.login.JobData;
import photo.software.student.PrintUtilities;

import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@SuppressWarnings("serial")
public class SpringOrderFormGUI extends JInternalFrame 
{
	private JTextField textField,textField_1,textField_2,textField_3,textField_4, textField_5,
				textField_6,textField_7,textField_8,textField_9,textField_10,textField_11;
	private JTextPane textPane;
	private String schoolPath;
	private JobData job;
	private SpringStudent current;
	
	private JPanel panel;
	private File imageFile;
	private BufferedImage stuImage;
	private Image scaledImage;
	private JLabel imageLabel;
	
	private DateFormat dateFormat;
	private Date date;
	
	SpringGUI gui;
	private JTextField textField_12;

	public SpringOrderFormGUI(String schoolPath, JobData job, SpringStudent current, SpringGUI gui) 
	{
		this.schoolPath = schoolPath;
		this.job = job;
		this.current = current;
		this.gui = gui;
		initialize();
		loadThumbnail();
		
		
	}
	private void loadThumbnail()
	{
		panel.removeAll();
		imageFile = new File(schoolPath+"\\CroppedMed\\"+current.img);
		if(imageFile.exists())
		{
			try
			{
				stuImage = ImageIO.read(imageFile);
				scaledImage = stuImage.getScaledInstance(220, -1, Image.SCALE_FAST);
				imageLabel = new JLabel(new ImageIcon(scaledImage));
				panel.add(imageLabel);
				stuImage.flush();
				scaledImage.flush();
			}catch(IOException e){JOptionPane.showMessageDialog(null, "Error Displaing Image: "+e);}
		}
		panel.updateUI();
	}
	private void initialize()
	{
		this.setClosable(true);
		setBounds(100, 100, 690, 590);
		getContentPane().setLayout(new MigLayout("", "[99.00][100.00][100.00][100.00,grow][240.00]", "[50.00][][][][][][][][][][][][][][][89.00][]"));
		
		JLabel lblReordermissingOrderInfo = new JLabel("Reorder/Missing Order Info");
		lblReordermissingOrderInfo.setFont(new Font("Tahoma", Font.BOLD, 22));
		getContentPane().add(lblReordermissingOrderInfo, "cell 0 0 5 1,alignx center");
		
		JLabel lblJob = new JLabel("Job:");
		getContentPane().add(lblJob, "cell 0 1,alignx right");
		
		textField = new JTextField();
		textField.setText(job.job);
		textField.setEditable(false);
		getContentPane().add(textField, "cell 1 1 3 1,growx");
		textField.setColumns(10);
		
		JLabel lblSchool = new JLabel("School:");
		getContentPane().add(lblSchool, "cell 0 2,alignx trailing");
		
		textField_11 = new JTextField();
		textField_11.setText(job.location);
		textField_11.setEditable(false);
		getContentPane().add(textField_11, "cell 1 2 3 1,growx");
		textField_11.setColumns(10);
		
		panel = new JPanel();
		getContentPane().add(panel, "cell 4 1 1 13,grow");
		
		dateFormat = new SimpleDateFormat("MM/dd/yyyy HH:mm");
		date = new Date();		
		
		JLabel lblDate = new JLabel("Date: "+date);
		getContentPane().add(lblDate, "cell 1 3 3 1");
		
		JLabel lblFirst = new JLabel("First:");
		getContentPane().add(lblFirst, "cell 0 4,alignx trailing");
		
		textField_4 = new JTextField();
		textField_4.setText(current.first);
		getContentPane().add(textField_4, "cell 1 4,growx");
		textField_4.setColumns(10);
		
		JLabel lblLast = new JLabel("Last:");
		getContentPane().add(lblLast, "cell 2 4,alignx trailing");
		
		textField_1 = new JTextField();
		textField_1.setText(current.last);
		getContentPane().add(textField_1, "cell 3 4,growx");
		textField_1.setColumns(10);
		
		JLabel lblSpokeWith = new JLabel("Spoke With:");
		getContentPane().add(lblSpokeWith, "cell 0 5,alignx right");
		
		textField_2 = new JTextField();
		getContentPane().add(textField_2, "cell 1 5,growx");
		textField_2.setColumns(10);
		
		JLabel lblPhone = new JLabel("Phone:");
		getContentPane().add(lblPhone, "cell 0 6,alignx right");
		
		textField_3 = new JTextField();
		getContentPane().add(textField_3, "cell 1 6,growx");
		textField_3.setColumns(10);
		
		JCheckBox chckbxReorder = new JCheckBox("Reorder");
		getContentPane().add(chckbxReorder, "cell 0 7");
		
		JCheckBox chckbxMissingImages = new JCheckBox("Missing Images");
		getContentPane().add(chckbxMissingImages, "cell 1 7");
		
		JCheckBox chckbxLateOrder = new JCheckBox("Late Order");
		getContentPane().add(chckbxLateOrder, "cell 2 7");
		
		JCheckBox chckbxRefund = new JCheckBox("Refund");
		getContentPane().add(chckbxRefund, "cell 3 7");
		
		JCheckBox chckbxDeliverToSchool = new JCheckBox("Deliver to School");
		getContentPane().add(chckbxDeliverToSchool, "cell 0 8");
		
		JCheckBox chckbxMailHome = new JCheckBox("Mail Home");
		getContentPane().add(chckbxMailHome, "cell 1 8");
		
		JCheckBox chckbxError = new JCheckBox("Error");
		getContentPane().add(chckbxError, "cell 3 8");
		
		JLabel lblOrder = new JLabel("Order1:");
		getContentPane().add(lblOrder, "cell 0 9,alignx trailing");
		
		textField_5 = new JTextField();
		textField_5.setText(current.order1);
		getContentPane().add(textField_5, "cell 1 9,growx");
		textField_5.setColumns(10);
		
		JLabel lblOrder_1 = new JLabel("Order2:");
		getContentPane().add(lblOrder_1, "cell 2 9,alignx trailing");
		
		textField_12 = new JTextField();
		textField_12.setText(current.order2);
		getContentPane().add(textField_12, "cell 3 9,growx");
		textField_12.setColumns(10);
		
		JLabel lblAddress = new JLabel("Address:");
		getContentPane().add(lblAddress, "cell 0 10,alignx trailing");
		
		textField_6 = new JTextField();
		getContentPane().add(textField_6, "cell 1 10 3 1,growx");
		textField_6.setColumns(10);
		
		JLabel lblCity = new JLabel("City:");
		getContentPane().add(lblCity, "cell 0 11,alignx trailing");
		
		textField_7 = new JTextField();
		getContentPane().add(textField_7, "cell 1 11,growx");
		textField_7.setColumns(10);
		
		JLabel lblState = new JLabel("State: ");
		getContentPane().add(lblState, "flowx,cell 2 11");
		
		textField_8 = new JTextField();
		getContentPane().add(textField_8, "cell 2 11");
		textField_8.setColumns(10);
		
		JLabel lblZip = new JLabel("Zip: ");
		getContentPane().add(lblZip, "flowx,cell 3 11");
		
		textField_9 = new JTextField();
		getContentPane().add(textField_9, "cell 3 11");
		textField_9.setColumns(10);
		
		JLabel lblCreditCardInfo = new JLabel("Credit Card Info:");
		getContentPane().add(lblCreditCardInfo, "cell 0 13,alignx trailing");
		
		textField_10 = new JTextField();
		getContentPane().add(textField_10, "cell 1 13 3 1,growx");
		textField_10.setColumns(10);
		
		JLabel lblRef = new JLabel("Ref: ");
		getContentPane().add(lblRef, "cell 4 14,alignx center");
		
		JScrollPane scrollPane = new JScrollPane();
		scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
		getContentPane().add(scrollPane, "cell 0 15 4 1,grow");
		
		textPane = new JTextPane(new DefaultStyledDocument(){
			public void insertString(int offs, String str, AttributeSet a) throws BadLocationException
			{
				if((getLength() + str.length()) <= 255) {super.insertString(offs, str, a);}
			    else Toolkit.getDefaultToolkit().beep();
			}
		});
		textPane.setText(current.notes);
		scrollPane.setViewportView(textPane);
		
		JLabel lblNotes = new JLabel("Notes:");
		getContentPane().add(lblNotes, "cell 1 16,alignx center");
		
		JButton btnSavePrint = new JButton("Save & Print");
		btnSavePrint.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent arg0)
			{
				String append = "\nDate: "+dateFormat.format(date);
				if(!textField_2.getText().equals("")) append+="\nSpoke: "+textField_2.getText().trim();
				if(!textField_3.getText().equals("")) append+="\n#: "+textField_3.getText().trim();
				if(!textField_6.getText().equals("")) append+="\nAddress: "+textField_6.getText().trim()+", "+textField_7.getText().trim()+", "+textField_8.getText().trim()+" "+textField_9.getText().trim();
				textPane.setText(textPane.getText()+append);
				textPane.select(0, 0);
				save();
				if(gui.updateFromOrderForm(current))			
				{
					print();
					close();
				}
			}
		});
		getContentPane().add(btnSavePrint, "cell 3 16,growx");
		this.setVisible(true);
	}
	private void save()
	{
		current.first = textField_4.getText();
		current.last = textField_1.getText();
		current.order1 = textField_5.getText();
		current.order2 = textField_12.getText();
		current.notes = textPane.getText();
	}
	private void print()
	{
		PrintUtilities.printComponent(this);
	}
	private void close()
	{
		this.dispose();
	}
}
