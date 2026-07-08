package photo.software.orders;

import java.awt.Image;

import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.ImageIcon;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.JComboBox;
import javax.swing.JCheckBox;
import javax.swing.JTextPane;
import javax.swing.JScrollPane;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.InternalFrameListener;

import org.apache.commons.io.comparator.NameFileComparator;

import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.login.SchoolData;
import photo.software.student.Student;
import photo.software.student.StudentGUI;
import photo.software.student.Students;

import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

@SuppressWarnings("serial")
public class DataEntryGUI extends JInternalFrame implements ActionListener{
	private JTextField textField,textField_1,textField_2;
	private JPanel panel_1,panel_3;
	private JComboBox<String> comboBox;
	private JTextPane textPane;
	private JCheckBox chckbxOrderPay,chckbxOrderPay_1;
	private JLabel label;
	
	private Students students;
	public Student current;
	private String schoolPath;
	private DesktopWindow window;
	private JobData job;
	private WatchScannerHotFolder watcher;
	
	private File imageFile;
	private BufferedImage stuImage;
	private Image scaledImage;
	private JLabel imageLabel;
	
	private ArrayList<String> studentLists;
	private String tempList;
	
	private File envelopeFolder;
	private File[] envelopes;
	private JScrollPane scrollPane_1;
	private SchoolData schoolData;
	private JComboBox<String> comboBox_1;
	public String scanFolder = "";
	
	public DataEntryGUI(DesktopWindow window, JobData job, SchoolData schoolData, Students students, String schoolPath) 
	{
		(envelopeFolder = new File(schoolPath+"\\Envelopes")).mkdirs();
		
		this.students = students;
		this.students.open();
		this.schoolPath = schoolPath;
		this.window = window;
		this.job = job;
		this.schoolData = schoolData;

		studentLists = students.getListNames();
		initialize();
		textField.setText(job.refNum);
		watcher = new WatchScannerHotFolder(schoolPath, this,scanFolder);
		
		this.students.search(job.refNum);
		current = this.students.current;
		do{}while(!watcher.emptyHotFolder());
		watcher.start();
		loadCurrent();
	}
	private void initialize()
	{
		setBounds(100, 100, 999, 900);
		getContentPane().setLayout(new MigLayout("", "[340.00][610.00]", "[121.00][414.00][][][275.00]"));
		this.setVisible(true);
		
		JPanel panel = new JPanel();
		getContentPane().add(panel, "cell 0 0,grow");
		panel.setLayout(new MigLayout("", "[][grow]", "[][][]"));
		
		JLabel lblReferenceNumber = new JLabel("Reference Number:");
		panel.add(lblReferenceNumber, "cell 0 0,alignx right");
		
		textField = new JTextField();
		textField.addActionListener(this);
		panel.add(textField, "cell 1 0,growx");
		textField.setColumns(10);
		
		JLabel lblList = new JLabel("List:");
		panel.add(lblList, "cell 0 2,alignx trailing");
		
		comboBox = new JComboBox<String>();
		comboBox.addItem("");
		
		for(String l:studentLists) comboBox.addItem(l);
		comboBox.setEditable(true);
		panel.add(comboBox, "cell 1 2,growx");
		
		JPanel panel_2 = new JPanel();
		getContentPane().add(panel_2, "cell 1 0,grow");
		panel_2.setLayout(new MigLayout("", "[][][][][grow]", "[][][]"));
		
		JLabel lblOrder = new JLabel("Order1:");
		panel_2.add(lblOrder, "cell 0 0,alignx trailing");
		
		textField_1 = new JTextField();
		textField_1.addActionListener(this);
		panel_2.add(textField_1, "cell 1 0,growx");
		textField_1.setColumns(10);
		
		JLabel lblOrder_1 = new JLabel("Order 2:");
		panel_2.add(lblOrder_1, "cell 2 0,alignx trailing");
		
		textField_2 = new JTextField();
		textField_2.addActionListener(this);
		panel_2.add(textField_2, "cell 3 0,growx");
		textField_2.setColumns(10);
		
		JScrollPane scrollPane = new JScrollPane();
		panel_2.add(scrollPane, "cell 4 0 1 3,grow");
		
		textPane = new JTextPane();
		scrollPane.setViewportView(textPane);
		
		chckbxOrderPay = new JCheckBox("Order 1 Pay");
		panel_2.add(chckbxOrderPay, "cell 1 1");
		
		chckbxOrderPay_1 = new JCheckBox("Order 2 Pay");
		panel_2.add(chckbxOrderPay_1, "cell 3 1");
		
		//Student Image Panel
		panel_1 = new JPanel();
		getContentPane().add(panel_1, "cell 0 1,grow");
		
		scrollPane_1 = new JScrollPane();
		getContentPane().add(scrollPane_1, "cell 1 1 1 4,grow");
		
		//Student Envelope Panel
		panel_3 = new JPanel();
		scrollPane_1.setViewportView(panel_3);
		
		label = new JLabel("");
		label.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(label, "flowx,cell 0 2");
		this.setClosable(true);
		this.setDefaultCloseOperation(DO_NOTHING_ON_CLOSE);
		this.addInternalFrameListener(new InternalFrameListener(){
			public void internalFrameActivated(InternalFrameEvent arg0) {}
			public void internalFrameClosed(InternalFrameEvent arg0) {}
			public void internalFrameClosing(InternalFrameEvent arg0) {close();}
			public void internalFrameDeactivated(InternalFrameEvent arg0) {}
			public void internalFrameDeiconified(InternalFrameEvent arg0) {}
			public void internalFrameIconified(InternalFrameEvent arg0) {}
			public void internalFrameOpened(InternalFrameEvent arg0) {}
		});
		
		comboBox_1 = new JComboBox<String>();
		comboBox_1.addItem("ScannerFolder1");
		comboBox_1.addItem("ScannerFolder2");
		comboBox_1.addActionListener(this);
		scanFolder = (String)comboBox_1.getSelectedItem();
		
		getContentPane().add(comboBox_1, "cell 0 3,growx");
		scanFolder = (String)comboBox_1.getSelectedItem();
	}

	public void close()
	{
		saveCurrent();
		students.close();
		window.add(new StudentGUI(window, job, schoolData, students));
		watcher.interrupt();
		watcher.stopRunning();
		this.dispose();
	}
	private void saveCurrent()
	{
		current.order1 = textField_1.getText().trim();
		current.order2 = textField_2.getText().trim();
		current.order1Pay = chckbxOrderPay.isSelected()+"";
		current.order2Pay = chckbxOrderPay_1.isSelected()+"";
		current.notes = textPane.getText();
		students.saveStudent(current);
		
		if(!(tempList = ((String)comboBox.getSelectedItem()).trim()).equals(""))
		{
			if(!studentLists.contains((String)comboBox.getSelectedItem()))
			{
				students.addStudentToList((String)comboBox.getSelectedItem(), current.ref, false);
				comboBox.removeAllItems();
				comboBox.addItem("");
				for(String l:studentLists = students.getListNames()) comboBox.addItem(l);
				comboBox.setSelectedItem(tempList);
			}
			else students.addStudentToList((String)comboBox.getSelectedItem(), current.ref, false);
		}
		
		textField.requestFocusInWindow();
		textField.selectAll();
	}
	private void loadCurrent()
	{
		if(students.search(textField.getText()))
		{
			current = students.current;
			label.setText(current.first+" "+current.last);
			textField_1.setText(current.order1);
			textField_2.setText(current.order2);
			textPane.setText(current.notes);
			chckbxOrderPay.setSelected(true);
			chckbxOrderPay_1.setSelected(Boolean.parseBoolean(current.order2Pay));
			loadThumbnail();
			textField_1.requestFocusInWindow();
			watcher.setCaptureGUI(this);
		}
		
	}
	public void updateEnvelope(File envelope)
	{
		panel_3.removeAll();
		if(envelope.exists())
		{
			try {
				stuImage = ImageIO.read(envelope);
				scaledImage = stuImage.getScaledInstance(550, -1, Image.SCALE_FAST);
				imageLabel = new JLabel(new ImageIcon(scaledImage));
				panel_3.add(imageLabel);
				stuImage.flush();
				scaledImage.flush();
			} catch (IOException e) {System.out.println("Error: "+e);}
		}
		//panel_3.repaint();
		panel_3.updateUI();
		
	}
	private void loadThumbnail()
	{
		panel_1.removeAll();
		panel_3.removeAll();
		imageFile = new File(schoolPath+"\\CroppedMed\\"+current.ref+".jpg");
		if(imageFile.exists())
		{
			try {
				stuImage = ImageIO.read(imageFile);
				scaledImage = stuImage.getScaledInstance(340, -1, Image.SCALE_FAST);
				imageLabel = new JLabel(new ImageIcon(scaledImage));
				panel_1.add(imageLabel);
				stuImage.flush();
				scaledImage.flush();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		if(current.order1Pay.equals("true"))
		{
			
			envelopes = envelopeFolder.listFiles();
			Arrays.sort(envelopes, NameFileComparator.NAME_INSENSITIVE_REVERSE);
			for(File e:envelopes)
			{
				if(e.getName().contains(current.ref))
				{
					try
					{
						stuImage = ImageIO.read(e);
						scaledImage = stuImage.getScaledInstance(550, -1, Image.SCALE_FAST);
						imageLabel = new JLabel(new ImageIcon(scaledImage));
						panel_3.add(imageLabel);
						stuImage.flush();
						scaledImage.flush();
					}catch(Exception err){}
					
				}
			}
		}
		panel_1.updateUI();
		panel_3.updateUI();

	}
	
	public void actionPerformed(ActionEvent e) {
		Object pressed = e.getSource();
		if(pressed==textField)
		{
			saveCurrent();
			loadCurrent();
		}
		else if((pressed==textField_1)||(pressed==textField_2))
		{
			saveCurrent();
		}
		else if(pressed==comboBox_1)
		{
			watcher.stopRunning();
			scanFolder = (String)comboBox_1.getSelectedItem();
			watcher = new WatchScannerHotFolder(schoolPath, this,scanFolder);
			do{}while(!watcher.emptyHotFolder());
			watcher.start();
		}
	}

}
