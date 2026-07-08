package photo.software.spring;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileFilter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JComponent;
import javax.swing.JFileChooser;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.KeyStroke;
import javax.swing.UIManager;

import net.miginfocom.swing.MigLayout;

import javax.swing.JPanel;
import javax.swing.border.TitledBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.InternalFrameListener;
import javax.swing.table.DefaultTableModel;
import javax.swing.text.AbstractDocument;

import photo.software.student.Student;
import photo.software.student.Students;

import java.awt.Font;

import javax.swing.JTextField;
import javax.swing.JComboBox;

import org.apache.commons.io.FileUtils;

import javax.swing.JButton;

@SuppressWarnings("serial")
public class SpringAddImagesGUI extends JInternalFrame implements InternalFrameListener
{
	JPanel link_panel, panel_1, imageLink_panel, panel_search;
	
	private int currentIndex = 0, totalImages = 0;
	private JScrollPane linkScrollPane;
	private JTable linkTable;
	private DefaultTableModel linkModel;
	private String[] linkColumnNames = {"Image","Reference"};
	private String[][] imageLinkArray;
	private String[] imagePath;
	
	private JScrollPane searchScrollPane;
	private JTable searchTable;
	private DefaultTableModel searchModel;	
	private String[] searchColumnNames = {"Reference","First","Last","Homeroom","Grade"};
	private String[][] searchTableArray;
	
	
	private ArrayList<Student> fallStudents, fallSearch, addStudents;
	private String fallPath;
	File imgFile, searchFile, imageFolder;
	private BufferedImage stuImage;
	private Image scaledImage;
	private JLabel searchLabel;
	private JLabel lblRef;
	private JLabel lblLast;
	private JLabel lblFirst;
	private JLabel lblHomeroom;
	private JLabel lblGrade;
	private JTextField textField, textField_1, textField_2, textField_3;
	private JPanel searchPanelBox;
	private JPanel searchPanelTable;
	private JPanel searchPanelImage;
	private JLabel lblSearch;
	private JTextField textField_4;
	private JLabel lblCategory;
	private JComboBox<String> comboBox;
	SpringGUI springGUI;
	public boolean closed = true;
	private JButton btnAddStudents;

	public SpringAddImagesGUI(String fallPath, SpringGUI springGUI) 
	{
		this.springGUI = springGUI;
		initialize();
		if(openFallDatabase(fallPath))
		{
			if(openImageFolder())
			{
				updateLinkTable();
				textField_4.setText(" ");
				textField_4.setText("");
				closed = false;
			}
			else this.dispose();
		}
		else this.dispose();
		
	}
	private boolean openFallDatabase(String fallPath)
	{
		fallStudents = new ArrayList<Student>();
		this.fallPath = fallPath;
		Students fall = new Students(fallPath+"\\Database\\Students.accdb");
		if(fall.openStudentDatabase())
		{
			fallStudents = fall.getStudents();
			fall.close();
			return true;
		}
		return false;
	}
	private boolean openImageFolder()
	{
		JFileChooser fc = new JFileChooser();
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		if(fc.showOpenDialog(null) == JFileChooser.APPROVE_OPTION)
		{
			imageFolder = fc.getSelectedFile();
			File[] images = imageFolder.listFiles(new FileFilter(){
				public boolean accept(File arg0){
					if(arg0.getName().toUpperCase().endsWith(".JPG")) return true;
					return false;
				}
			});
			totalImages = images.length;
			imageLinkArray = new String[images.length][2];
			imagePath = new String[images.length];
			for(int i=0;i<totalImages;i++)
			{
				imagePath[i] = images[i].getAbsolutePath();
				imageLinkArray[i][0] = images[i].getName();
				imageLinkArray[i][1] = "";
			}
			if(new File(imageFolder.getAbsolutePath()+"\\SpringLink.txt").exists())
			{
				readSpringLink(new File(imageFolder.getAbsolutePath()+"\\SpringLink.txt"));
			}
			return true;
		}
		return false;
	}
	private void readSpringLink(File f)
	{
		try 
		{
			BufferedReader in = new BufferedReader(new FileReader(f));
			String line = null;
			String split[] = new String[2];
			while((line = in.readLine())!=null)
			{
				split = line.split("\t");
				if(!split[1].equals("BLANK"))
				{
					for(int i=0;i<totalImages;i++)
					{
						if(split[0].equals(imageLinkArray[i][0]))
						{
							imageLinkArray[i][1] = split[1];
							break;
						}
					}
				}
			}
			in.close();
		} catch (Exception  e) {JOptionPane.showMessageDialog(null, "Error Reading SpringLink: "+e);
		}
		
	}
	private void updateLinkTable()
	{
		linkModel = new DefaultTableModel(imageLinkArray,linkColumnNames){
			@Override
			public boolean isCellEditable(int row, int column){
				return false;
			}
		};
		linkTable = new JTable(linkModel);
		linkTable.addMouseListener(new MouseAdapter(){
			public void mouseClicked(MouseEvent e)
			{
				if(e.getClickCount()==2)
				{
					currentIndex = linkTable.getSelectedRow();
					loadCurrent(currentIndex);
				}
			}
		});
		linkTable.setPreferredScrollableViewportSize(new Dimension(300, 400));
		linkTable.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0), "Enter");

		link_panel.removeAll();
		linkScrollPane = new JScrollPane(linkTable);
		link_panel.add(linkScrollPane);
		link_panel.updateUI();
	}
	private boolean addSpringImages()
	{
		addStudents = new ArrayList<Student>();
		Student temp;
		for(int i=0;i<totalImages;i++)
		{
			if(!imageLinkArray[i][1].equals(""))
			{
				for(Student s:fallStudents)
				{
					if(s.ref.equals(imageLinkArray[i][1]))
					{
						temp = new Student(s);
						temp.field1 = imageLinkArray[i][1]+"_"+imageLinkArray[i][0];
						addStudents.add(temp);
						break;
					}
				}
			}
		}
		for(int i=0;i<totalImages;i++)
		{
			if(!imageLinkArray[i][0].equals(""))
			{
				if(!new File(imagePath[i])
				.renameTo(new File(imageFolder.getAbsolutePath()+"\\"
						+imageLinkArray[i][1]+"_"+imageLinkArray[i][0])))
				{
					if(!new File(imageFolder.getAbsolutePath()+"\\"
							+imageLinkArray[i][1]+"_"+imageLinkArray[i][0]).exists())
					{
						JOptionPane.showMessageDialog(null, "Unable to rename: "+imageLinkArray[i][0]);
						return false;
					}
				}
			}
		}
		try
		{
			FileUtils.copyDirectory(imageFolder, new File(springGUI.schoolPath+"\\CroppedLarge"));
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Copying Images: "+e);return false;}
		return springGUI.addFallStudentInformation(addStudents);
	}
	private void nextSpringRecord()
	{
		currentIndex++;
		if(currentIndex==imagePath.length) currentIndex=0;
		
		loadCurrent(currentIndex);
		linkTable.setRowSelectionInterval(currentIndex, currentIndex);
		textField_4.requestFocus();
		textField_4.selectAll();
	}
	private void newSpringLink(String reference)
	{
		imageLinkArray[currentIndex][1] = reference;
		linkModel.setValueAt(reference, currentIndex, 1);
		for(int i=0;i<imagePath.length;i++)
		{
			if(i!=currentIndex && imageLinkArray[i][1].equals(reference))
			{
				JOptionPane.showMessageDialog(null, "Reference Number already Linked to index: "+i);
			}
		}
	}
	private void updateLinkImage(String image)
	{
		imageLink_panel.removeAll();
		imgFile = new File(image);
		if(imgFile.exists())
		{
			try 
			{
				stuImage = ImageIO.read(imgFile);
				scaledImage = stuImage.getScaledInstance(320, -1, Image.SCALE_FAST);
				searchLabel = new JLabel(new ImageIcon(scaledImage));
				imageLink_panel.add(searchLabel);
				stuImage.flush();
				scaledImage.flush();
			} catch (IOException e) {JOptionPane.showMessageDialog(null, "Unable to display spring picture... Odd..:"+e);}
		}
		imageLink_panel.updateUI();
	}
	private void loadCurrent(int row)
	{
		if(imageLinkArray[row][1].equals(""))
		{
			lblRef.setText("Ref:");
			textField.setText("");
			textField_1.setText("");
			textField_2.setText("");
			textField_3.setText("");
		}
		else
		{
			for(Student s:fallStudents)
			{
				if(s.ref.equals(imageLinkArray[row][1]))
				{
					lblRef.setText("Ref: "+s.ref);
					textField.setText(s.first);
					textField_1.setText(s.last);
					textField_2.setText(s.homeroom);
					textField_3.setText(s.grade);
					break;
				}
			}
		}
		updateLinkImage(imagePath[row]);
	}
	private void search()
	{
		String value = textField_4.getText();
		fallSearch = new ArrayList<Student>();
		
		searchPanelImage.removeAll();
		
		switch(comboBox.getSelectedIndex())
		{
			case 0:
				for(Student s:fallStudents)
					if(s.last.contains(value))
						fallSearch.add(s);
				break;
			case 1:
				for(Student s:fallStudents)
					if(s.first.contains(value))
						fallSearch.add(s);
				break;
			case 2:
				for(Student s:fallStudents)
					if(s.homeroom.contains(value))
						fallSearch.add(s);
				break;
			case 3:
				for(Student s:fallStudents)
					if(s.grade.contains(value))
						fallSearch.add(s);
				break;
			case 4:
				for(Student s:fallStudents)
					if(s.ref.contains(value))
						fallSearch.add(s);
				break;
		}
		searchTableArray = new String[fallSearch.size()][5];
		for(int i=0;i<fallSearch.size();i++)
		{
			searchTableArray[i][0] = fallSearch.get(i).ref;
			searchTableArray[i][1] = fallSearch.get(i).first;
			searchTableArray[i][2] = fallSearch.get(i).last;
			searchTableArray[i][3] = fallSearch.get(i).homeroom;
			searchTableArray[i][4] = fallSearch.get(i).grade;
		}
	}
	private void updateSearchTable()
	{
		searchModel = new DefaultTableModel(searchTableArray,searchColumnNames){
			@Override
			public boolean isCellEditable(int row, int column){
				return false;
			}
		};
		searchTable = new JTable(searchModel);
		searchTable.addMouseListener(new MouseAdapter(){
			public void mousePressed(MouseEvent e){
				updateSearchPicture(searchTableArray[searchTable.getSelectedRow()][0]);
			}
			public void mouseClicked(MouseEvent e)
			{
				if(e.getClickCount()==2)
				{
					newSpringLink(searchTableArray[searchTable.getSelectedRow()][0]);
					nextSpringRecord();
				}
			}
		});
		searchTable.addKeyListener(new KeyAdapter(){
			public void keyPressed(KeyEvent e)
			{
				if((e.getKeyCode()==KeyEvent.VK_ENTER)&&(searchTable.getSelectedRow()!=-1))
				{
					newSpringLink(searchTableArray[searchTable.getSelectedRow()][0]);
					nextSpringRecord();
				}
			}
		});
		searchTable.setPreferredScrollableViewportSize(new Dimension(625, 240));
		searchTable.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0), "Enter");

		searchPanelTable.removeAll();
		searchScrollPane = new JScrollPane(searchTable);
		searchPanelTable.add(searchScrollPane);
		searchPanelTable.updateUI();
	}
	public void close()
	{
		if(!closed)
		{
			save();
			this.dispose();
			closed = true;
		}
	}
	private void save()
	{
		String save = "";
		for(int i=0;i<totalImages;i++)
		{
			if(imageLinkArray[i][1].equals("")) save+=imageLinkArray[i][0]+"\tBLANK\n";
			else save+=imageLinkArray[i][0]+"\t"+imageLinkArray[i][1]+"\n";
		}
		try 
		{
			BufferedWriter writer = new BufferedWriter(new FileWriter(new File(imageFolder+"\\SpringLink.txt")));
			writer.write(save);
			writer.close();
		} catch (IOException e) {JOptionPane.showMessageDialog(null, "Error Saving... Bummer: "+e);}
		
	}
	private void updateSearchPicture(String image)
	{
		searchPanelImage.removeAll();
		searchFile = new File(fallPath+"\\CroppedMed\\"+image+".jpg");
		if(searchFile.exists())
		{
			try 
			{
				stuImage = ImageIO.read(searchFile);
				scaledImage = stuImage.getScaledInstance(230, -1, Image.SCALE_FAST);
				searchLabel = new JLabel(new ImageIcon(scaledImage));
				searchPanelImage.add(searchLabel);
				stuImage.flush();
				scaledImage.flush();
			} catch (IOException e) {JOptionPane.showMessageDialog(null, "Unable to display search picture... Odd..:"+e);}
		}
		searchPanelImage.updateUI();
	}
	
	private void initialize()
	{
		UpcaseFilter upper = new UpcaseFilter();
		setBounds(100, 100, 1100, 820);
		getContentPane().setLayout(new MigLayout("", "[329.00][300.00][351.00]", "[430.00][340.00]"));
		
		link_panel = new JPanel();
		getContentPane().add(link_panel, "cell 0 0,grow");
		
		panel_1 = new JPanel();
		getContentPane().add(panel_1, "cell 1 0,grow");
		panel_1.setLayout(new MigLayout("", "[][grow]", "[][][][][][][][][][][][][][]"));
		
		lblRef = new JLabel("Ref: ");
		lblRef.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_1.add(lblRef, "cell 0 0 2 1");
		
		lblLast = new JLabel("Last:");
		lblLast.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_1.add(lblLast, "cell 0 2,alignx trailing");
		
		textField = new JTextField();
		textField.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_1.add(textField, "cell 1 2,growx");
		textField.setColumns(10);
		
		lblFirst = new JLabel("First:");
		lblFirst.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_1.add(lblFirst, "cell 0 3,alignx trailing");
		
		textField_1 = new JTextField();
		textField_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_1.add(textField_1, "cell 1 3,growx");
		textField_1.setColumns(10);
		
		lblHomeroom = new JLabel("Homeroom:");
		lblHomeroom.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_1.add(lblHomeroom, "cell 0 4,alignx trailing");
		
		textField_2 = new JTextField();
		textField_2.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_1.add(textField_2, "cell 1 4,growx");
		textField_2.setColumns(10);
		
		lblGrade = new JLabel("Grade:");
		lblGrade.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_1.add(lblGrade, "cell 0 5,alignx trailing");
		
		textField_3 = new JTextField();
		textField_3.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_1.add(textField_3, "cell 1 5,growx");
		textField_3.setColumns(10);
		
		btnAddStudents = new JButton("Add Students");
		btnAddStudents.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent arg0) {
				save();
				if(addSpringImages())
				{
					JOptionPane.showMessageDialog(null, "Students added!");
					closed = true;
					dispose();
				}
			}
		});
		btnAddStudents.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_1.add(btnAddStudents, "cell 0 12 2 1,growx");
		
		
		imageLink_panel = new JPanel();
		getContentPane().add(imageLink_panel, "cell 2 0,grow");
		
		//////////////////////////////////////Search Panel///////////////////////////////
		panel_search = new JPanel();
		panel_search.setBorder(new TitledBorder(UIManager.getBorder("TitledBorder.border"), "Spring Search", TitledBorder.CENTER, TitledBorder.TOP, null, new Color(0, 0, 0)));
		getContentPane().add(panel_search, "cell 0 1 3 1,grow");
		panel_search.setLayout(new MigLayout("", "[670.00][267.00]", "[35.00][261.00]"));
		
		///////Search Panel Options///////
		searchPanelBox = new JPanel();
		panel_search.add(searchPanelBox, "cell 0 0,grow");
		searchPanelBox.setLayout(new MigLayout("", "[71.00][171.00][138.00][207.00]", "[]"));
		
		lblSearch = new JLabel("Search:");
		lblSearch.setFont(new Font("Tahoma", Font.PLAIN, 16));
		searchPanelBox.add(lblSearch, "cell 0 0,alignx trailing");
		
		textField_4 = new JTextField();
		((AbstractDocument) textField_4.getDocument()).setDocumentFilter(upper);
		textField_4.getDocument().addDocumentListener(new DocumentListener() {
			  public void changedUpdate(DocumentEvent e) {
					search();
					updateSearchTable();
			  }
			  public void removeUpdate(DocumentEvent e) {
					search();
					updateSearchTable();
			  }
			  public void insertUpdate(DocumentEvent e) {
					search();
					updateSearchTable();
			  }});
		textField_4.setFont(new Font("Tahoma", Font.PLAIN, 16));
		searchPanelBox.add(textField_4, "cell 1 0,growx");
		textField_4.setColumns(10);
		
		lblCategory = new JLabel("Category:");
		lblCategory.setFont(new Font("Tahoma", Font.PLAIN, 16));
		searchPanelBox.add(lblCategory, "cell 2 0,alignx trailing");
		
		comboBox = new JComboBox<String>();
		String[] searchChoices = {"Last Name","First Name","Homeroom","Grade","Ref Number"};
		for(String s:searchChoices) comboBox.addItem(s);
		comboBox.setFont(new Font("Tahoma", Font.PLAIN, 16));
		searchPanelBox.add(comboBox, "cell 3 0,growx");
		
		searchPanelImage = new JPanel();
		panel_search.add(searchPanelImage, "cell 1 0 1 2,grow");
		
		searchPanelTable = new JPanel();
		panel_search.add(searchPanelTable, "cell 0 1,grow");
		
		this.setClosable(true);
		this.setVisible(true);
		this.addInternalFrameListener(this);
	}
	public void dispose()
	{
		super.dispose();
	}
	@Override
	public void internalFrameActivated(InternalFrameEvent arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void internalFrameClosed(InternalFrameEvent arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void internalFrameClosing(InternalFrameEvent arg0) {
		save();
		closed = true;
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
}

