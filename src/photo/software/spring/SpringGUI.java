package photo.software.spring;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Image;
import java.awt.Toolkit;

import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.ImageIcon;
import javax.swing.JComponent;
import javax.swing.JFileChooser;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.JComboBox;
import javax.swing.JTextPane;
import javax.swing.JButton;
import javax.swing.KeyStroke;
import javax.swing.ScrollPaneConstants;
import javax.swing.UIManager;
import javax.swing.border.TitledBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.table.DefaultTableModel;
import javax.swing.text.AbstractDocument;
import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;
import javax.swing.text.DefaultStyledDocument;
import javax.swing.text.DocumentFilter;

import photo.software.admin.SmallCrops;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.login.SchoolData;
import photo.software.spring.render.RenderSpringOrderGUI;
import photo.software.student.Student;
import photo.software.student.capture.DisplayEnvelopesGUI;

import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileFilter;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JMenuBar;
import javax.swing.JMenu;
import javax.swing.JMenuItem;

@SuppressWarnings("serial")
public class SpringGUI extends JInternalFrame implements ActionListener{
	
	private JPanel panel_fallImg, panel_springImg, panel_search;
	private JTextField textField, textField_1, textField_2;
	private JTextPane textPane;
	private JLabel lblReference;
	private JComboBox<String> comboBox, comboBox_1, comboBox_2;
	private File imageFile, searchFile;
	private String[] GRADES = {"","EXMPT","FAC","PRE","TK","KIN","01","02","03","04","05","06",
			"07","08","09","10","11","12","13","14","15"};
	private ArrayList<String> homerooms;
	
	private JButton btnPrevious, btnNext, btnViewEnvelope;
	
	private JTable table;
	private JScrollPane scrollPane;
	private DefaultTableModel model;
	private String[] columnNames = {"Reference","Image","Last","First","Homeroom","Grade"};
	private String[][] tempTableArray;
	private String[][] imageLinkArray;
	private int totalImages=0;
	private String[] imagePath;
	
	DesktopWindow window;
	JobData job;
	SchoolData schoolData;
	SpringStudent current;
	ArrayList<SpringStudent> allSpring, foundList;
	SpringStudents students;
	public String schoolName, schoolPath, fallPath;
	
	BufferedImage stuImage;
	Image scaledImage;
	JLabel imageLabel,searchLabel;
	private JPanel searchPanelBox;
	private JPanel searchPanelImage;
	private JPanel searchPanelTable;
	private JLabel lblSearch;
	private JTextField textField_3;
	private JLabel lblCategory;
	private JScrollPane scrollPane_1;
	private JMenuBar menuBar;
	private JMenu mnFile;
	private JMenuItem mntmClose;
	private JMenuItem mntmChooseImageFolder;
	public SpringAddImagesGUI addSpring;
	private JMenuItem mntmDataEntry;
	private JMenuItem mntmCreateCroppedmed;
	private JMenuItem mntmRenderOrders;
	private JMenuItem mntmFixJPGName;
	private JButton btnOrderFrom;
	private JLabel lblOrder_1;
	private JTextField textField_4;
	private JLabel lblFirstName;
	private JTextField textField_5;
	private JLabel lblFavoriteThing;
	private JLabel lblWantToBe;
	private JTextField textField_6;
	private JTextField textField_7;
	private JMenuItem mntmImportOnlineOrders;

	public SpringGUI(DesktopWindow window, JobData job, SchoolData schoolData, SpringStudents students) 
	{
		this.window = window;
		this.job = job;
		this.schoolData = schoolData;
		this.students = students;
		this.schoolName = job.location;
		schoolPath = window.jobs+"\\"+job.location+"\\"+job.job;
		initialize();
		current = null;
		this.students.open();
		fallPath = this.students.fallPath;
		allSpring = this.students.getStudents();
		if(allSpring.size()>0)
		{
			current = this.students.setCurrentStudent(job.refNum);
			initializeComboBox();
			loadCurrent();
		}
		textField_3.setText(" ");
		textField_3.setText("");
		
		menuBar = new JMenuBar();
		setJMenuBar(menuBar);
		
		mnFile = new JMenu("File");
		menuBar.add(mnFile);
		
		mntmChooseImageFolder = new JMenuItem("Choose Image Folder");
		mntmChooseImageFolder.addActionListener(this);
		mnFile.add(mntmChooseImageFolder);
		
		mntmClose = new JMenuItem("Close");
		mntmClose.addActionListener(this);
				
		mntmDataEntry = new JMenuItem("Data Entry");
		mntmDataEntry.addActionListener(this);
		
		mntmFixJPGName = new JMenuItem("Fix JPG Names");
		mntmFixJPGName.addActionListener(this);
		
		mntmCreateCroppedmed = new JMenuItem("Create CroppedMed");
		mntmCreateCroppedmed.addActionListener(this);
		mnFile.add(mntmFixJPGName);
		mnFile.add(mntmCreateCroppedmed);
		
		mntmImportOnlineOrders = new JMenuItem("Import Online Orders");
		mntmImportOnlineOrders.addActionListener(this);
		mnFile.add(mntmImportOnlineOrders);
		mnFile.add(mntmDataEntry);
		
		mntmRenderOrders = new JMenuItem("Render Orders");
		mntmRenderOrders.addActionListener(this);
		mnFile.add(mntmRenderOrders);
		
		mnFile.add(mntmClose);
		
	}
	
	public boolean addFallStudentInformation(ArrayList<Student> fallStudents)
	{
		if(students.addSpringStudents(fallStudents))
		{
			allSpring = students.getStudents();
			initializeComboBox();
			textField_3.setText(" ");
			textField_3.setText("");
			return true;
		}
		return false;
	}
	private void initializeComboBox()
	{
		homerooms = new ArrayList<String>();
		for(SpringStudent s:allSpring) if(!homerooms.contains(s.homeroom)) homerooms.add(s.homeroom);
		Collections.sort(homerooms);
		comboBox.removeAllItems();
		for(String h:homerooms) comboBox.addItem(h);
	}
	private void loadCurrent()
	{
		current = students.current;
		lblReference.setText("Spring Img: "+current.img);
		textField.setText(current.last);
		textField_1.setText(current.first);
		comboBox.setSelectedItem(current.homeroom);
		comboBox_1.setSelectedItem(current.grade);
		textField_2.setText(current.order1);
		textField_4.setText(current.order2);
		textPane.setText(current.notes);
		textField_5.setText(current.text1);
		textField_6.setText(current.text2);
		textField_7.setText(current.text3);
		loadFallThumb();
		loadSpringThumb();
	}
	private void loadFallThumb()
	{
		panel_fallImg.removeAll();
		imageFile = new File(fallPath+"\\CroppedMed\\"+current.ref+".jpg");
		if(imageFile.exists())
		{
			try
			{
				stuImage = ImageIO.read(imageFile);
				scaledImage = stuImage.getScaledInstance(300,-1,Image.SCALE_SMOOTH);
				imageLabel = new JLabel(new ImageIcon(scaledImage));
				panel_fallImg.add(imageLabel);
				stuImage.flush();
				scaledImage.flush();
			}catch(IOException e){JOptionPane.showMessageDialog(null, "Error Displaying: "+imageFile.getName()+": "+e);}
		}
		panel_fallImg.updateUI();
	}
	private void loadSpringThumb()
	{
		panel_springImg.removeAll();
		imageFile = new File(schoolPath+"\\CroppedMed\\"+current.img);
		if(imageFile.exists())
		{
			try
			{
				stuImage = ImageIO.read(imageFile);
				scaledImage = stuImage.getScaledInstance(340,-1,Image.SCALE_SMOOTH);
				imageLabel = new JLabel(new ImageIcon(scaledImage));
				panel_springImg.add(imageLabel);
				stuImage.flush();
				scaledImage.flush();
			}catch(IOException e){JOptionPane.showMessageDialog(null, "Error Displaying: "+imageFile.getName()+": "+e);}
		}
		panel_springImg.updateUI();
	}
	private void saveCurrent(boolean needToSave)
	{
		boolean updateComboBox = false;
		if(!current.last.equals(textField.getText())){current.last = textField.getText().trim();needToSave = true;}
		if(!current.first.equals(textField_1.getText())){current.first = textField_1.getText().trim();needToSave = true;}
		if(!current.order1.equals(textField_2.getText())){current.order1 = textField_2.getText().trim();needToSave = true;}
		if(!current.order2.equals(textField_4.getText())){current.order2 = textField_4.getText().trim();needToSave = true;}
		if(!current.text1.equals(textField_5.getText())){current.text1 = textField_5.getText().trim();needToSave = true;}
		if(!current.text2.equals(textField_6.getText())){current.text2 = textField_6.getText().trim();needToSave = true;}
		if(!current.text3.equals(textField_7.getText())){current.text3 = textField_7.getText().trim();needToSave = true;}
		if(!current.notes.equals(textPane.getText())){current.notes = textPane.getText().trim();needToSave = true;}
		if(!current.grade.equals(comboBox_1.getSelectedItem())){current.grade = (String)comboBox_1.getSelectedItem();needToSave = true;}
		
		if(!current.homeroom.equals(comboBox.getSelectedItem()))
		{
			current.homeroom = (String)comboBox.getSelectedItem();
			needToSave = true;
			updateComboBox = true;
		}
		if(needToSave)
		{
			students.saveStudent(current);
			students.setCurrentStudent(current.ref);
			allSpring = students.getStudents();
			if(updateComboBox == true) initializeComboBox();
			/*
			 * I don't think this actually does anything.			 
			if(students.currentIndex<=model.getRowCount())
			{
				if(model.getValueAt(students.currentIndex, 0).equals(current.ref))
				{
					model.setValueAt(current.last, students.currentIndex, 2);
					model.setValueAt(current.first, students.currentIndex, 3);
					model.setValueAt(current.homeroom, students.currentIndex, 4);
					model.setValueAt(current.grade, students.currentIndex, 5);
					return;
				}
			}
			*/
			for(int i=0;i<model.getRowCount();i++)
			{
				if(model.getValueAt(i, 0).equals(current.ref))
				{
					model.setValueAt(current.last, i, 2);
					model.setValueAt(current.first, i, 3);
					model.setValueAt(current.homeroom, i, 4);
					model.setValueAt(current.grade, i, 5);
					return;
				}
			}	
			
			
		}
	}
	public void close()
	{
		if(addSpring!=null)
		{
			addSpring.close();
		}
		saveCurrent(false);
		students.close();
		this.dispose();
	}
	private void showEnvelope()
	{
		File envelopeFolder = new File(schoolPath+"\\Envelopes");
		ArrayList<File> orderEnvelopes = new ArrayList<File>();
		if(envelopeFolder.exists())
		{
			File[] envelopes = envelopeFolder.listFiles();
			for(File e:envelopes)
			{
				if(e.getName().contains(current.ref)) orderEnvelopes.add(e);
			}
		}
		if(orderEnvelopes.size()==0) JOptionPane.showMessageDialog(null,"No Envelopes for current Reference Number");
		else
		{
			window.add(new DisplayEnvelopesGUI(orderEnvelopes));
			this.moveToBack();
		}
	}
	public void updateTable()
	{
		model = new DefaultTableModel(tempTableArray,columnNames){
			@Override
			public boolean isCellEditable(int row, int column){
				return false;
			}
		};
		table = new JTable(model);
		table.addMouseListener(new MouseAdapter(){
			public void mousePressed(MouseEvent e){
				updateSearchPicture(tempTableArray[table.getSelectedRow()][1]);
			}
			public void mouseClicked(MouseEvent e)
			{
				if(e.getClickCount()==2)
				{
					saveCurrent(false);
					students.search(tempTableArray[table.getSelectedRow()][0]);
					loadCurrent();
				}
			}
		});
		table.addKeyListener(new KeyAdapter(){
			public void keyPressed(KeyEvent e)
			{
				if((e.getKeyCode()==KeyEvent.VK_ENTER)&&(table.getSelectedRow()!=-1))
				{
					saveCurrent(false);
					students.search(tempTableArray[table.getSelectedRow()][0]);
					loadCurrent();
				}
			}
		});
		table.setPreferredScrollableViewportSize(new Dimension(650, 200));
		table.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0), "Enter");

		searchPanelTable.removeAll();
		scrollPane = new JScrollPane(table);
		searchPanelTable.add(scrollPane);
		searchPanelTable.updateUI();
	}
	
	private void search()
	{
		String value = textField_3.getText();
		foundList = new ArrayList<SpringStudent>();
		
		searchPanelImage.removeAll();
		
		switch(comboBox_2.getSelectedIndex())
		{
			case 0:
				for(SpringStudent s:allSpring)
					if(s.last.contains(value))
						foundList.add(s);
				break;
			case 1:
				for(SpringStudent s:allSpring)
					if(s.first.contains(value))
						foundList.add(s);
				break;
			case 2:
				for(SpringStudent s:allSpring)
					if(s.homeroom.contains(value))
						foundList.add(s);
				break;
			case 3:
				for(SpringStudent s:allSpring)
					if(s.grade.contains(value))
						foundList.add(s);
				break;
			case 4:
				for(SpringStudent s:allSpring)
					if(s.ref.contains(value))
						foundList.add(s);
				break;
		}
		tempTableArray = new String[foundList.size()][6];
		for(int i=0;i<foundList.size();i++)
		{
			tempTableArray[i][0] = foundList.get(i).ref;
			tempTableArray[i][1] = foundList.get(i).img;
			tempTableArray[i][2] = foundList.get(i).last;
			tempTableArray[i][3] = foundList.get(i).first;
			tempTableArray[i][4] = foundList.get(i).homeroom;
			tempTableArray[i][5] = foundList.get(i).grade;
		}
	}
	private void updateSearchPicture(String image)
	{
		searchPanelImage.removeAll();
		searchFile = new File(schoolPath+"\\CroppedMed\\"+image);
		if(searchFile.exists())
		{
			try 
			{
				stuImage = ImageIO.read(searchFile);
				scaledImage = stuImage.getScaledInstance(200, -1, Image.SCALE_FAST);
				searchLabel = new JLabel(new ImageIcon(scaledImage));
				searchPanelImage.add(searchLabel);
				stuImage.flush();
				scaledImage.flush();
			} catch (IOException e) {JOptionPane.showMessageDialog(null, "Unable to display search picture... Odd..:"+e);}
		}
		searchPanelImage.updateUI();
	}
	public boolean updateFromOrderForm(SpringStudent formStudent)
	{
		if(current.ref.equals(formStudent.ref))
		{
			textField.setText(formStudent.last);
			textField_1.setText(formStudent.first);
			textField_2.setText(formStudent.order1);
			textField_4.setText(formStudent.order2);
			textField_5.setText(formStudent.text1);
			textField_6.setText(formStudent.text2);
			textField_7.setText(formStudent.text3);
			textPane.setText(formStudent.notes);
			saveCurrent(true);
			return true;
		}
		else JOptionPane.showMessageDialog(null, "SpringGUI student does not match OrderFormGUI student");
		return false;
	}
	
	private void initialize()
	{
		
		UpcaseFilter upper = new UpcaseFilter();
		setBounds(100, 100, 1100, 1000);
		this.setLocation(0, 0);
		getContentPane().setLayout(new MigLayout("", "[400.00][310.00][350.00]", "[550.00][350.00]"));
		
		JPanel panel = new JPanel();
		getContentPane().add(panel, "cell 0 0,grow");
		panel.setLayout(new MigLayout("", "[190.00][189.00]", "[][][][][][][][][][][][85.00][][][][]"));
		
		lblReference = new JLabel("Spring Img: ");
		lblReference.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblReference, "cell 0 0 2 1");
		
		textField = new JTextField();
		((AbstractDocument) textField.getDocument()).setDocumentFilter(upper);
		textField.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(textField, "cell 0 1,growx");
		textField.setColumns(10);
		
		textField_1 = new JTextField();
		((AbstractDocument) textField_1.getDocument()).setDocumentFilter(upper);
		textField_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(textField_1, "cell 1 1,growx");
		textField_1.setColumns(10);
		
		JLabel lblLast = new JLabel("Last");
		panel.add(lblLast, "cell 0 2,alignx center");
		
		JLabel lblFirst = new JLabel("First");
		panel.add(lblFirst, "cell 1 2,alignx center");
		
		comboBox = new JComboBox<String>();
		((AbstractDocument) ((JTextField) comboBox.getEditor().getEditorComponent()).getDocument()).setDocumentFilter(upper);
		comboBox.setEditable(true);
		comboBox.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(comboBox, "cell 0 3,growx");
		
		comboBox_1 = new JComboBox<String>();
		comboBox_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		for(String g:GRADES) comboBox_1.addItem(g);
		panel.add(comboBox_1, "cell 1 3,growx");
		
		JLabel lblHomeroom = new JLabel("Homeroom");
		panel.add(lblHomeroom, "cell 0 4,alignx center");
		
		JLabel lblGrade = new JLabel("Grade");
		panel.add(lblGrade, "cell 1 4,alignx center");
		
		JLabel lblOrder = new JLabel("Order1:");
		panel.add(lblOrder, "flowx,cell 0 5,alignx trailing");
		
		lblOrder_1 = new JLabel("Order2:");
		panel.add(lblOrder_1, "flowx,cell 1 5");
		
		lblFirstName = new JLabel("First Name:");
		panel.add(lblFirstName, "flowx,cell 0 7 2 1");
		
		lblFavoriteThing = new JLabel("Favorite Thing:");
		panel.add(lblFavoriteThing, "flowx,cell 0 8 2 1");
		
		lblWantToBe = new JLabel("Want to be:");
		panel.add(lblWantToBe, "flowx,cell 0 9 2 1");
		
		scrollPane_1 = new JScrollPane();
		scrollPane_1.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
		panel.add(scrollPane_1, "cell 0 11 2 1,grow");
		
		textPane = new JTextPane(new DefaultStyledDocument(){
			public void insertString(int offs, String str, AttributeSet a) throws BadLocationException
			{
				if((getLength() + str.length()) <= 255) {super.insertString(offs, str, a);}
			    else Toolkit.getDefaultToolkit().beep();
			}
		});
		scrollPane_1.setViewportView(textPane);
		textPane.setFont(new Font("Tahoma", Font.PLAIN, 16));
		
		JLabel lblNotes = new JLabel("Notes");
		panel.add(lblNotes, "cell 0 12 2 1,alignx center");
		
		btnPrevious = new JButton("Previous");
		btnPrevious.addActionListener(this);
		btnPrevious.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(btnPrevious, "cell 0 13,growx");
		
		btnNext = new JButton("Next");
		btnNext.addActionListener(this);
		btnNext.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(btnNext, "cell 1 13,growx");
		
		btnOrderFrom = new JButton("Order Form");
		btnOrderFrom.addActionListener(this);
		btnOrderFrom.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(btnOrderFrom, "cell 0 15,growx");
		
		btnViewEnvelope = new JButton("View Envelope");
		btnViewEnvelope.addActionListener(this);
		btnViewEnvelope.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(btnViewEnvelope, "cell 1 15,growx");
		
		textField_2 = new JTextField();
		((AbstractDocument) textField_2.getDocument()).setDocumentFilter(upper);
		textField_2.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(textField_2, "cell 0 5,growx");
		textField_2.setColumns(10);
		
		textField_4 = new JTextField();
		panel.add(textField_4, "cell 1 5,grow");
		textField_4.setColumns(10);
		
		textField_5 = new JTextField();
		panel.add(textField_5, "cell 0 7,growx");
		textField_5.setColumns(10);
		
		textField_6 = new JTextField();
		panel.add(textField_6, "cell 0 8,growx");
		textField_6.setColumns(10);
		
		textField_7 = new JTextField();
		panel.add(textField_7, "cell 0 9,growx");
		textField_7.setColumns(10);
		
		panel_fallImg = new JPanel();
		panel_fallImg.setBorder(new TitledBorder(UIManager.getBorder("TitledBorder.border"), "Fall Image", TitledBorder.CENTER, TitledBorder.TOP, null, new Color(0, 0, 0)));
		getContentPane().add(panel_fallImg, "cell 1 0,grow");
		
		panel_springImg = new JPanel();
		panel_springImg.setBorder(new TitledBorder(UIManager.getBorder("TitledBorder.border"), "Spring Image", TitledBorder.CENTER, TitledBorder.TOP, null, new Color(0, 0, 0)));
		getContentPane().add(panel_springImg, "cell 2 0,grow");
		
		
		
		//////////////////////////////////////Search Panel///////////////////////////////
		panel_search = new JPanel();
		panel_search.setBorder(new TitledBorder(UIManager.getBorder("TitledBorder.border"), "Spring Search", TitledBorder.CENTER, TitledBorder.TOP, null, new Color(0, 0, 0)));
		getContentPane().add(panel_search, "cell 0 1 3 1,grow");
		panel_search.setLayout(new MigLayout("", "[693.00][329.00]", "[46.00][253.00]"));
		
		///////Search Panel Options///////
		searchPanelBox = new JPanel();
		panel_search.add(searchPanelBox, "cell 0 0,grow");
		searchPanelBox.setLayout(new MigLayout("", "[][220.00][96.00][grow]", "[grow]"));
		
		lblSearch = new JLabel("Search:");
		lblSearch.setFont(new Font("Tahoma", Font.PLAIN, 16));
		searchPanelBox.add(lblSearch, "cell 0 0,alignx trailing");
		
		textField_3 = new JTextField();
		textField_3.addActionListener(this);
		textField_3.getDocument().addDocumentListener(new DocumentListener() {
			  public void changedUpdate(DocumentEvent e) {
					search();
					updateTable();
			  }
			  public void removeUpdate(DocumentEvent e) {
					search();
					updateTable();
			  }
			  public void insertUpdate(DocumentEvent e) {
					search();
					updateTable();
			  }});
		textField_3.setFont(new Font("Tahoma", Font.PLAIN, 16));
		((AbstractDocument) textField_3.getDocument()).setDocumentFilter(upper);
		searchPanelBox.add(textField_3, "cell 1 0,growx");
		textField_3.setColumns(10);
		
		lblCategory = new JLabel("Category:");
		lblCategory.setFont(new Font("Tahoma", Font.PLAIN, 16));
		searchPanelBox.add(lblCategory, "cell 2 0,alignx trailing");
		
		comboBox_2 = new JComboBox<String>();
		String[] searchChoices = {"Last Name","First Name","Homeroom","Grade","Ref Number"};
		for(String s:searchChoices) comboBox_2.addItem(s);
		comboBox_2.setFont(new Font("Tahoma", Font.PLAIN, 16));
		searchPanelBox.add(comboBox_2, "cell 3 0,growx");
		
		searchPanelImage = new JPanel();
		panel_search.add(searchPanelImage, "cell 1 0 1 2,grow");
		
		searchPanelTable = new JPanel();
		panel_search.add(searchPanelTable, "cell 0 1,grow");
		
		this.setVisible(true);
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
	
	@Override
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		if(pressed==btnPrevious)
		{
			saveCurrent(false);
			students.previous();
			loadCurrent();
		}
		else if(pressed==btnNext)
		{
			saveCurrent(false);
			students.next();
			loadCurrent();
		}
		else if(pressed==btnViewEnvelope)
		{
			showEnvelope();
		}
		else if(pressed==mntmImportOnlineOrders)
		{
			JFileChooser fc = new JFileChooser(schoolPath+"\\Database");
			if(fc.showOpenDialog(null)==JFileChooser.APPROVE_OPTION)
			{
				String onlineOrders = fc.getSelectedFile().getAbsolutePath();
				ImportOnlineOrders input = new ImportOnlineOrders(onlineOrders);
				ArrayList<String[]> data = input.getData();
				if(students.importOnlineData(data)) JOptionPane.showMessageDialog(null, "Complete!");
				else JOptionPane.showMessageDialog(null, "Nope.  Did not work.");
			}
		}
		else if(pressed==btnOrderFrom)
		{
			window.add(new SpringOrderFormGUI(schoolPath,job,current,this));
			this.moveToBack();
		}
		else if(pressed==mntmClose)
		{
			close();
			window.chooseJob();
		}
		else if(pressed==mntmChooseImageFolder)
		{
			addSpring = new SpringAddImagesGUI(fallPath,this);
			window.add(addSpring);
			this.moveToBack();
		}
		else if(pressed==mntmFixJPGName)
		{
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			if(fc.showOpenDialog(null)==JFileChooser.APPROVE_OPTION)
			{
				
				File imageFolder = fc.getSelectedFile();
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
							}
						}
					}
				}
			}
		}
		else if(pressed==mntmDataEntry)
		{
			close();
			window.add(new SpringDataEntryGUI(window,job,schoolData,students,schoolPath));
		}
		else if(pressed==mntmCreateCroppedmed)
		{
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			if(fc.showOpenDialog(null)==JFileChooser.APPROVE_OPTION)
			{
				new SmallCrops(fc.getSelectedFile());
			}
		}
		else if(pressed==mntmRenderOrders)
		{
			saveCurrent(false);
			window.add(new RenderSpringOrderGUI(allSpring, window, current.ref,schoolPath,job,schoolData));
			this.moveToBack();
		}
	}

}

class UpcaseFilter extends DocumentFilter{
	  public void insertString(DocumentFilter.FilterBypass fb, int offset,
		      String text, AttributeSet attr) throws BadLocationException {
		    fb.insertString(offset, text.toUpperCase(), attr);
		  }

		  //no need to override remove(): inherited version allows all removals

		  public void replace(DocumentFilter.FilterBypass fb, int offset, int length,
		      String text, AttributeSet attr) throws BadLocationException {
		    fb.replace(offset, length, text.toUpperCase(), attr);
		  }
}
