package photo.software.student;


import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.ImageIcon;
import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.JCheckBox;
import javax.swing.JTextPane;
import javax.swing.ScrollPaneConstants;

import java.awt.Font;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.swing.JPanel;

import photo.software.login.JobData;

import javax.swing.JButton;
import javax.swing.JScrollPane;

@SuppressWarnings("serial")
public class OrderFormGUI extends JInternalFrame 
{
	private JTextField textField,textField_1,textField_2,textField_3,textField_4,textField_5;
	private JTextField textField_6,textField_7,textField_8,textField_9,textField_10,textField_11;
	private JCheckBox chckbxOrderPay,chckbxOrderPay_1;
	
	private JTextPane textPane;
	
	private JPanel panel;
	private File imageFile;
	private BufferedImage stuImage;
	private Image scaledImage;
	private JLabel imageLabel;

	private String schoolPath;
	private JobData job;
	private Student current;
	private StudentGUI gui;
	
	private DateFormat dateFormat;
	private Date date;
	private JTextField textField_12;
	
	
	public OrderFormGUI(String schoolPath, JobData job, Student current, StudentGUI gui) 
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
		imageFile = new File(schoolPath+"\\CroppedSmall\\"+current.ref+".jpg");
		if(imageFile.exists())
		{
			try {
				stuImage = ImageIO.read(imageFile);
				scaledImage = stuImage.getScaledInstance(220, -1, Image.SCALE_FAST);
				imageLabel = new JLabel(new ImageIcon(scaledImage));
				panel.add(imageLabel);
				stuImage.flush();
				scaledImage.flush();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		panel.updateUI();
	}
	private void initialize()
	{
		this.setClosable(true);
		setBounds(100, 100, 774, 590);
		getContentPane().setLayout(new MigLayout("", "[100.00][160.00][82.00][161.00][250.00]", "[][][][][][][][][][][][][][][][][140.00][]"));
		
		JLabel lblReordermissingOrderInfo = new JLabel("Reorder/Missing Order Info");
		lblReordermissingOrderInfo.setFont(new Font("Tahoma", Font.PLAIN, 20));
		getContentPane().add(lblReordermissingOrderInfo, "cell 0 0 4 1,alignx center");
		
		JLabel lblJob = new JLabel("Job:");
		getContentPane().add(lblJob, "cell 0 1,alignx trailing");
		
		textField_10 = new JTextField();
		textField_10.setText(job.job);
		textField_10.setEditable(false);
		getContentPane().add(textField_10, "cell 1 1 3 1,growx");
		textField_10.setColumns(10);
		
		dateFormat = new SimpleDateFormat("MM/dd/yyyy HH:mm");
		date = new Date();		
		
		JLabel lblSchool = new JLabel("School:");
		getContentPane().add(lblSchool, "cell 0 2,alignx trailing");
		
		textField_11 = new JTextField();
		textField_11.setText(job.location);
		textField_11.setEditable(false);
		getContentPane().add(textField_11, "cell 1 2 3 1,growx");
		textField_11.setColumns(10);
		
		panel = new JPanel();
		getContentPane().add(panel, "cell 4 2 1 11,grow");
		JLabel lblDate = new JLabel("Date: "+dateFormat.format(date));
		getContentPane().add(lblDate, "cell 1 3 3 1,alignx left");
		
		JLabel lblFirst = new JLabel("First:");
		getContentPane().add(lblFirst, "cell 0 4,alignx trailing");
		
		textField_1 = new JTextField();
		textField_1.setText(current.first);
		getContentPane().add(textField_1, "cell 1 4,growx");
		textField_1.setColumns(10);
		
		JLabel lblLast = new JLabel("Last:");
		getContentPane().add(lblLast, "cell 2 4,alignx trailing");
		
		textField = new JTextField();
		textField.setText(current.last);
		getContentPane().add(textField, "cell 3 4,growx");
		textField.setColumns(10);
		
		JLabel lblSpokeWith = new JLabel("Spoke With:");
		getContentPane().add(lblSpokeWith, "cell 0 5,alignx trailing");
		
		textField_2 = new JTextField();
		getContentPane().add(textField_2, "cell 1 5,growx");
		textField_2.setColumns(10);
		
		JLabel lblPhone = new JLabel("Phone:");
		getContentPane().add(lblPhone, "cell 0 6,alignx trailing");
		
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
		
		textField_4 = new JTextField();
		textField_4.setText(current.order1);
		getContentPane().add(textField_4, "cell 1 9,growx");
		textField_4.setColumns(10);
		
		textField_5 = new JTextField();
		textField_5.setText(current.order2);
		getContentPane().add(textField_5, "cell 3 9,growx");
		textField_5.setColumns(10);
		
		chckbxOrderPay = new JCheckBox("Order 1 Pay");
		chckbxOrderPay.setSelected(Boolean.parseBoolean(current.order1Pay));
		getContentPane().add(chckbxOrderPay, "cell 1 10");
		
		chckbxOrderPay_1 = new JCheckBox("Order 2 Pay");
		chckbxOrderPay_1.setSelected(Boolean.parseBoolean(current.order2Pay));
		getContentPane().add(chckbxOrderPay_1, "cell 3 10");
		
		JLabel lblAddress = new JLabel("Address:");
		getContentPane().add(lblAddress, "cell 0 11,alignx trailing");
		
		textField_6 = new JTextField();
		getContentPane().add(textField_6, "cell 1 11 3 1,growx");
		textField_6.setColumns(10);
		
		JLabel lblCity = new JLabel("City:");
		getContentPane().add(lblCity, "cell 0 12,alignx trailing");
		
		textField_7 = new JTextField();
		getContentPane().add(textField_7, "cell 1 12,growx");
		textField_7.setColumns(10);
		
		JLabel lblState = new JLabel("State:");
		getContentPane().add(lblState, "flowx,cell 2 12,alignx trailing");
		
		JLabel lblZip = new JLabel("Zip:");
		getContentPane().add(lblZip, "flowx,cell 3 12,alignx trailing");
		
		textField_9 = new JTextField();
		getContentPane().add(textField_9, "cell 3 12,growx");
		textField_9.setColumns(10);
		
		JLabel lblRef = new JLabel("Ref: "+current.ref);
		getContentPane().add(lblRef, "cell 4 13,alignx center");
		
		JLabel lblCreditCard = new JLabel("Credit Card Info:");
		getContentPane().add(lblCreditCard, "cell 0 14,alignx trailing");
		
		textField_12 = new JTextField();
		getContentPane().add(textField_12, "cell 1 14 3 1,growx");
		textField_12.setColumns(10);
		
		JScrollPane scrollPane = new JScrollPane();
		scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
		getContentPane().add(scrollPane, "cell 0 16 4 1,grow");
		
		textPane = new JTextPane();
		textPane.setFont(new Font("Tahoma", Font.PLAIN, 11));
		scrollPane.setViewportView(textPane);
		textPane.setText(current.notes);
		
		JLabel lblNotes = new JLabel("Notes:");
		getContentPane().add(lblNotes, "cell 1 17,alignx center");
		
		textField_8 = new JTextField();
		getContentPane().add(textField_8, "cell 2 12,growx");
		textField_8.setColumns(10);
		
		JButton btnSavePrint = new JButton("Save & Print");
		btnSavePrint.addActionListener(new ActionListener()
		{
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
		getContentPane().add(btnSavePrint, "cell 3 17,growx");
		this.setVisible(true);
	}
	private void save()
	{
		current.first = textField_1.getText();
		current.last = textField.getText();
		current.order1 = textField_4.getText();
		current.order2 = textField_5.getText();
		current.order1Pay = chckbxOrderPay.isSelected()+"";
		current.order2Pay = chckbxOrderPay_1.isSelected()+"";
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
