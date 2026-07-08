package photo.software.spring;

import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.ImageIcon;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.JTextPane;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.InternalFrameListener;





import org.apache.commons.io.comparator.NameFileComparator;

import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.login.SchoolData;

import java.awt.Font;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;

@SuppressWarnings("serial")
public class SpringDataEntryGUI extends JInternalFrame implements ActionListener
{
	private JTextField textField,textField_1;
	private JTextPane textPane;
	private JLabel lblName, lblReference;

	private JPanel panel_1, panel_2;

	private File imageFile;
	private BufferedImage stuImage;
	private Image scaledImage;
	private JLabel imageLabel;
	
	private File envelopeFolder;
	private File[] envelopes;
	private SpringWatchScannerHotFolder watcher;
	
	private DesktopWindow window;
	private JobData job;
	SchoolData schoolData;
	private String schoolPath;
	private SpringStudents students;
	public SpringStudent current;
	private JLabel lblOrder_1;
	private JTextField textField_2;
	private JLabel lblScanFolderScannerfolder;
	private JLabel lblFirstName;
	private JLabel lblFavorite;
	private JLabel lblWantToBe;
	private JTextField textField_3;
	private JTextField textField_4;
	private JTextField textField_5;
	
	public SpringDataEntryGUI(DesktopWindow window, JobData job, SchoolData schoolData, SpringStudents students, String schoolPath) 
	{
		(envelopeFolder = new File(schoolPath+"\\Envelopes")).mkdirs();
		this.students = students;
		this.students.open();
		this.schoolPath = schoolPath;
		this.window = window;
		this.job = job;
		this.schoolData = schoolData;
		
		initialize();
		this.students.search(job.refNum);
		current = this.students.current;
		watcher = new SpringWatchScannerHotFolder(schoolPath, this);
		do{}while(!watcher.emptyHotFolder());
		watcher.start();
		lblReference.setText("Reference: "+current.ref);
		lblName.setText("Name: "+current.first+" "+current.last);
		textField_1.setText(current.order1);
		textField_2.setText(current.order2);
		textPane.setText(current.notes);
		loadThumbnail();
		textField.requestFocusInWindow();
		textField.selectAll();
	}
	private void initialize()
	{
		setBounds(100, 100, 1100, 901);
		this.setLocation(0, 0);
		getContentPane().setLayout(new MigLayout("", "[400.00][575.00]", "[277.00][518.00]"));
		
		JPanel panel = new JPanel();
		getContentPane().add(panel, "cell 0 0 2 1,grow");
		panel.setLayout(new MigLayout("", "[][250.00,grow][300.00][350.00]", "[][][][][][][][][9.00][]"));
		
		JLabel lblImageNumber = new JLabel("Image Number:");
		lblImageNumber.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblImageNumber, "cell 0 0,alignx trailing");
		
		textField = new JTextField();
		textField.addActionListener(this);
		textField.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(textField, "cell 1 0,growx");
		textField.setColumns(10);
		
		textPane = new JTextPane();
		textPane.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(textPane, "cell 3 0 1 7,grow");
		
		JLabel lblOrder = new JLabel("Order1:");
		lblOrder.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblOrder, "cell 0 1,alignx trailing");
		
		textField_1 = new JTextField();
		textField_1.addActionListener(this);
		textField_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(textField_1, "cell 1 1,growx");
		textField_1.setColumns(10);
		
		lblOrder_1 = new JLabel("Order2:");
		lblOrder_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblOrder_1, "cell 0 2,alignx trailing");
		
		textField_2 = new JTextField();
		textField_2.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(textField_2, "cell 1 2,grow");
		textField_2.setColumns(10);
		
		lblFirstName = new JLabel("First Name:");
		lblFirstName.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblFirstName, "cell 0 3,alignx trailing");
		
		textField_3 = new JTextField();
		panel.add(textField_3, "cell 1 3,growx");
		textField_3.setColumns(10);
		
		lblFavorite = new JLabel("Favorite:");
		lblFavorite.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblFavorite, "cell 0 4,alignx trailing");
		
		textField_4 = new JTextField();
		panel.add(textField_4, "cell 1 4,growx");
		textField_4.setColumns(10);
		
		lblWantToBe = new JLabel("Want to be:");
		lblWantToBe.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblWantToBe, "cell 0 5,alignx trailing");
		
		textField_5 = new JTextField();
		panel.add(textField_5, "cell 1 5,growx");
		textField_5.setColumns(10);
		
		lblReference = new JLabel("Reference:");
		lblReference.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblReference, "cell 0 6 2 1");
		
		lblName = new JLabel("Name:");
		lblName.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblName, "cell 0 7 2 1");
		
		JLabel lblNotes = new JLabel("Notes");
		lblNotes.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblNotes, "cell 3 7,alignx center");
		
		lblScanFolderScannerfolder = new JLabel("Scan Folder: ScannerFolder1");
		lblScanFolderScannerfolder.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblScanFolderScannerfolder, "cell 0 9 2 1");
		
		panel_1 = new JPanel();
		getContentPane().add(panel_1, "cell 0 1,grow");
		
		panel_2 = new JPanel();
		getContentPane().add(panel_2, "cell 1 1,grow");
		this.setVisible(true);
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
	}
	private void loadCurrent()
	{
		if(students.searchImg(textField.getText()))
		{
			current = students.current;
			lblReference.setText("Reference: "+current.ref);
			lblName.setText("Name: "+current.first+" "+current.last);
			textField_1.setText(current.order1);
			textField_2.setText(current.order2);
			if(current.text1.equals("")) textField_3.setText(current.first.substring(0, 1).toUpperCase() + current.first.substring(1).toLowerCase());
			else textField_3.setText(current.text1);
			textField_4.setText(current.text2);
			textField_5.setText(current.text3);
			textPane.setText(current.notes);
			loadThumbnail();
			textField_1.requestFocusInWindow();
			textField_1.selectAll();
		}
		else textField.selectAll();
	}
	private void loadThumbnail()
	{
		panel_1.removeAll();
		panel_2.removeAll();
		imageFile = new File(schoolPath+"\\CroppedMed\\"+current.img);
		if(imageFile.exists())
		{
			try
			{
				stuImage = ImageIO.read(imageFile);
				scaledImage = stuImage.getScaledInstance(340,-1,Image.SCALE_FAST);
				imageLabel = new JLabel(new ImageIcon(scaledImage));
				panel_1.add(imageLabel);
				stuImage.flush();
				scaledImage.flush();
			}catch(IOException e){JOptionPane.showMessageDialog(null, "Unable to display thumbnail: "+e);}
		}
		
		envelopes = envelopeFolder.listFiles();
		if(envelopes.length>0)
		{
			Arrays.sort(envelopes, NameFileComparator.NAME_INSENSITIVE_REVERSE);
			for(File env:envelopes)
			{
				if(env.getName().contains(current.ref))
				{
					try
					{
						stuImage = ImageIO.read(env);
						scaledImage = stuImage.getScaledInstance(550,-1,Image.SCALE_FAST);
						imageLabel = new JLabel(new ImageIcon(scaledImage));
						panel_2.add(imageLabel);
						stuImage.flush();
						scaledImage.flush();
					}catch(IOException e){JOptionPane.showMessageDialog(null, "Unable to display Envelope: "+e);}
				}
			}
		}

		panel_1.updateUI();
		panel_2.updateUI();
		textField_1.requestFocusInWindow();
	}
	private void saveCurrent()
	{
		current.order1 = textField_1.getText();
		current.order2 = textField_2.getText();
		current.text1 = textField_3.getText();
		current.text2 = textField_4.getText();
		current.text3 = textField_5.getText();
		current.notes = textPane.getText();
		students.saveStudent(current);
		textField.requestFocusInWindow();
		textField.selectAll();
	}
	public void updateEnvelope(File envelope)
	{
		panel_2.removeAll();
		if(envelope.exists())
		{
			try
			{
				stuImage = ImageIO.read(envelope);
				scaledImage = stuImage.getScaledInstance(550,-1,Image.SCALE_FAST);
				imageLabel = new JLabel(new ImageIcon(scaledImage));
				panel_2.add(imageLabel);
				stuImage.flush();
				scaledImage.flush();
			}catch(IOException e){JOptionPane.showMessageDialog(null, "Unable to display Envelope: "+e);}
		}
		panel_2.updateUI();
	}

	@SuppressWarnings("removal")
	public void close()
	{
		saveCurrent();
		students.close();
		window.add(new SpringGUI(window,job,schoolData, students));
		watcher.stopRunning();
		watcher.stop();
		this.dispose();
	}
	@Override
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		if(pressed==textField)
		{
			saveCurrent();
			loadCurrent();
		}
		else if(pressed==textField_1)
		{
			saveCurrent();
		}
		
	}
}
