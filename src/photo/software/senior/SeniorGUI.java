package photo.software.senior;

import photo.software.render.*;
import photo.software.senior.lists.ListMakerGUI;

import org.json.JSONObject;
import org.w3c.dom.Element;
import org.json.JSONException;
import org.json.JSONArray;

import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.PrintWriter;

import javax.swing.JInternalFrame;
import javax.swing.JPanel;
import javax.swing.JProgressBar;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextArea;

import net.miginfocom.swing.MigLayout;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.login.SchoolData;

import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.SwingUtilities;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.table.DefaultTableModel;
import javax.swing.text.AbstractDocument;
import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;
import javax.swing.text.DocumentFilter;
import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageTypeSpecifier;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.metadata.IIOMetadata;
import javax.imageio.stream.ImageOutputStream;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JFileChooser;
import javax.swing.JFrame;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.swing.JMenuBar;
import javax.swing.JMenu;
import javax.swing.BoxLayout;
import javax.swing.ImageIcon;
import javax.swing.JMenuItem;
import javax.swing.JOptionPane;

import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import javax.swing.border.TitledBorder;
import javax.swing.border.EtchedBorder;
import java.awt.Color;

public class SeniorGUI extends JInternalFrame implements ActionListener{

	private static final long serialVersionUID = 1L;
	private JTextField textField_Last;
	private JTextField textField_First;
	private JTextArea textArea;
	private JButton btnNext, btnPrevious;
	private JLabel lbl_Ref;
	private JPanel panel_FallImg;
	private JMenuItem mntmNewMenuItem, mntmNewMenuItem_1, mntmNewMenuItem_2;
	
	
	private DesktopWindow window;
	private JobData job;
	private SchoolData schoolData;
	private Seniors seniors;
	private String schoolPath, fallPath;
	private Senior current;
	private File imageFile;
	private JTextField textField_ID;
	private JLabel lblNewLabel;
	private JLabel lbl_Search;
	private JTextField textField_Search;
	private JPanel panel_Table, panel_Thumbnails;
	private JScrollPane scrollPane_Table;
	
	private JTable table;
	private DefaultTableModel model;
	private String[] columnNames = {"Reference","Last","First"};
	private String[][] tempTableArray;
	private ArrayList<Senior> foundList, allSeniors;
	private ArrayList<String> seniorImageNames;
	private int currentSeniorImageIndex;
	private String currentSeniorImage;
	private JPanel panel_CurrentSenior;
	private JScrollPane scrollPane;
	private JLabel lbl_SeniorImg;
	private JTextField textField_ImageOrder;
	private JPanel panel_SeniorImg;
	private JButton btn_PreviousImg;
	private JButton btn_NextImg;
	private JLabel lbl_Code;
	private JMenuItem mntmNewMenuItem_4;
	private JMenuItem mntmNewMenuItem_5;
	private JPanel panel_Formal;
	private JPanel panel_Circle;
	private JPanel panel;
	private JPanel panel_Selections;
	private JPanel panel_1;
	private JLabel lbl_Formal;
	private JLabel lbl_Circle;
	private JMenuItem mntmNewMenuItem_6;
	private JMenuItem mntmNewMenuItem_7;

	
	
	
	
	/*
	 * TODO:  Ability to create a list, and render by list/render date.  
	 * Ability to render individual.
	 * Export Formal and Circle
	 * Double check render settings for zip and digital download.
	 * 
	 * Option by date or list, for small crops and upload.
	 * 
	 * 
	 */

	/**
	 * Create the frame.
	 */
	public SeniorGUI(DesktopWindow window, JobData job, SchoolData schoolData, Seniors seniors) {
		this.window = window;
		this.job = job;
		this.schoolData = schoolData;
		this.seniors = seniors;
		
		
		JMenuBar menuBar = new JMenuBar();
		setJMenuBar(menuBar);
		
		JMenu mnNewMenu = new JMenu("File");
		menuBar.add(mnNewMenu);
		
		mntmNewMenuItem = new JMenuItem("Link Images");
		mntmNewMenuItem.addActionListener(this);
		mnNewMenu.add(mntmNewMenuItem);
		
		mntmNewMenuItem_2 = new JMenuItem("Create Cropped Med, Proofs & JSON");
		mntmNewMenuItem_2.addActionListener(this);
		mnNewMenu.add(mntmNewMenuItem_2);
		
		mntmNewMenuItem_4 = new JMenuItem("Render Orders");
		mntmNewMenuItem_4.addActionListener(this);
		
		mntmNewMenuItem_5 = new JMenuItem("Import Senior Orders");
		mntmNewMenuItem_5.addActionListener(this);		
		mnNewMenu.add(mntmNewMenuItem_5);
		mnNewMenu.add(mntmNewMenuItem_4);
		
		mntmNewMenuItem_6 = new JMenuItem("Export Images");
		mntmNewMenuItem_6.addActionListener(this);
		mnNewMenu.add(mntmNewMenuItem_6);
		
		mntmNewMenuItem_1 = new JMenuItem("Close");
		mntmNewMenuItem_1.addActionListener(this);
		
		mntmNewMenuItem_7 = new JMenuItem("Edit Lists");
		mntmNewMenuItem_7.addActionListener(this);
		mnNewMenu.add(mntmNewMenuItem_7);
		mnNewMenu.add(mntmNewMenuItem_1);
		
		
		
		

		
		schoolPath = window.jobs+"\\"+job.location+"\\"+job.job;
		
		
		seniors.openStudentDatabase();
		seniors.loadListDatabase();
		allSeniors = seniors.getSeniors();
		fallPath = seniors.getFallPath();
		
		initialize();
		loadCurrent();
		search();

	}
	
	@SuppressWarnings("serial")
	public void initialize() 
	{
		UpcaseFilter2 upper = new UpcaseFilter2();
		setBounds(100, 100, 1138, 800);
		this.setLocation(0, 0);
		getContentPane().setLayout(new MigLayout("", "[450px][200px][300px,grow][150px,grow]", "[400px][250px][250px]"));
		
		JPanel panel_Info = new JPanel();
		getContentPane().add(panel_Info, "cell 0 0,grow");
		panel_Info.setLayout(new MigLayout("", "[150px][150px][150px]", "[30px][40px][30px][40px][90px][30px][40px]"));
		
		lbl_Ref = new JLabel("Ref #:");
		lbl_Ref.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_Info.add(lbl_Ref, "cell 0 0,alignx left");
		
		textField_Last = new JTextField();
		((AbstractDocument) textField_Last.getDocument()).setDocumentFilter(upper);
		textField_Last.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_Info.add(textField_Last, "cell 0 1,growx");
		textField_Last.setColumns(10);
		
		textField_First = new JTextField();
		((AbstractDocument) textField_First.getDocument()).setDocumentFilter(upper);
		textField_First.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_Info.add(textField_First, "cell 1 1,growx");
		textField_First.setColumns(10);
		
		textField_ID = new JTextField();
		((AbstractDocument) textField_ID.getDocument()).setDocumentFilter(upper);
		textField_ID.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_Info.add(textField_ID, "cell 2 1,growx");
		textField_ID.setColumns(10);
		
		lblNewLabel = new JLabel("Student ID");
		panel_Info.add(lblNewLabel, "cell 2 2,alignx center,aligny top");
		
		textArea = new JTextArea();
		textArea.setFont(new Font("Tahoma", Font.PLAIN, 14));
		panel_Info.add(textArea, "cell 0 3 3 2,grow");
		textArea.setColumns(10);
		
		JLabel lbl_Last = new JLabel("Last\r\n");
		panel_Info.add(lbl_Last, "cell 0 2,alignx center,aligny top");
		
		JLabel lbl_First = new JLabel("First");
		panel_Info.add(lbl_First, "cell 1 2,alignx center,aligny top");
		
		btnPrevious = new JButton("Previous");
		btnPrevious.setFont(new Font("Tahoma", Font.PLAIN, 16));
		btnPrevious.addActionListener(this);
		
		JLabel lbl_Notes = new JLabel("Notes");
		lbl_Notes.setFont(new Font("Tahoma", Font.PLAIN, 11));
		panel_Info.add(lbl_Notes, "cell 1 5,alignx center,aligny top");
		panel_Info.add(btnPrevious, "cell 0 6,growx");
		
		btnNext = new JButton("Next");
		btnNext.setFont(new Font("Tahoma", Font.PLAIN, 16));
		btnNext.addActionListener(this);
		panel_Info.add(btnNext, "cell 1 6,growx");
		
		lbl_Code = new JLabel("Code:  ");
		lbl_Code.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_Info.add(lbl_Code, "cell 2 6");
		
		panel_FallImg = new JPanel();
		getContentPane().add(panel_FallImg, "cell 1 0,grow");
		
		panel_CurrentSenior = new JPanel();
		getContentPane().add(panel_CurrentSenior, "cell 2 0 1 3,grow");
		panel_CurrentSenior.setLayout(new MigLayout("", "[150px,grow][150px,grow]", "[360px][40px][30px][40px][grow]"));
		
		panel_SeniorImg = new JPanel();
		panel_CurrentSenior.add(panel_SeniorImg, "cell 0 0 2 1,grow");
		
		btn_PreviousImg = new JButton("Previous");
		btn_PreviousImg.addActionListener(this);
		btn_PreviousImg.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_CurrentSenior.add(btn_PreviousImg, "cell 0 1,growx");
		
		btn_NextImg = new JButton("Next");
		btn_NextImg.addActionListener(this);
		btn_NextImg.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_CurrentSenior.add(btn_NextImg, "cell 1 1,growx");
		
		lbl_SeniorImg = new JLabel("Senior Image #");
		lbl_SeniorImg.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_CurrentSenior.add(lbl_SeniorImg, "cell 0 2 2 1,alignx center,aligny top");
		
		textField_ImageOrder = new JTextField();
		textField_ImageOrder.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_CurrentSenior.add(textField_ImageOrder, "cell 0 3 2 1,growx");
		textField_ImageOrder.setColumns(10);
		
		panel_Thumbnails = new JPanel();
		panel_Thumbnails.setLayout(new BoxLayout(panel_Thumbnails, BoxLayout.Y_AXIS));
		scrollPane = new JScrollPane(panel_Thumbnails);
		scrollPane.setPreferredSize(new Dimension(140,500));
		getContentPane().add(scrollPane, "cell 3 0 1 3,grow");
		
		JPanel panel_Search = new JPanel();
		getContentPane().add(panel_Search, "cell 0 1 1 2,grow");
		panel_Search.setLayout(new MigLayout("", "[grow][grow]", "[50px][250px]"));
		
		lbl_Search = new JLabel("Search:");
		lbl_Search.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_Search.add(lbl_Search, "cell 0 0,alignx trailing");
		
		textField_Search = new JTextField();
		textField_Search.getDocument().addDocumentListener(new DocumentListener() {
			  public void changedUpdate(DocumentEvent e) {
					search();
			  }
			  public void removeUpdate(DocumentEvent e) {
					search();
			  }
			  public void insertUpdate(DocumentEvent e) {
					search();
			  }});
		textField_Search.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel_Search.add(textField_Search, "cell 1 0");
		textField_Search.setColumns(15);
		((AbstractDocument) textField_Search.getDocument()).setDocumentFilter(upper);
		
		model = new DefaultTableModel(columnNames,0)
		{
		    public boolean isCellEditable(int row, int column) {
		        return false; // All cells are not editable
		    }
		};
		table = new JTable(model);
		setupTable();
		
		panel_Table = new JPanel();
		panel_Search.add(panel_Table, "cell 0 1 2 1,grow");
		
		scrollPane_Table = new JScrollPane(table);
		panel_Table.add(scrollPane_Table);
		
		panel_Selections = new JPanel();
		getContentPane().add(panel_Selections, "cell 1 1 1 2,grow");
		panel_Selections.setLayout(new MigLayout("", "[200px]", "[200px][200px]"));
		
		panel = new JPanel();
		panel.setBorder(new TitledBorder(new EtchedBorder(EtchedBorder.LOWERED, new Color(255, 255, 255), new Color(160, 160, 160)), "Formal Selection", TitledBorder.CENTER, TitledBorder.TOP, null, new Color(0, 0, 0)));
		panel_Selections.add(panel, "cell 0 0,grow");
		panel.setLayout(new MigLayout("", "[200px]", "[180px][20px]"));
		
		panel_Formal = new JPanel();
		panel.add(panel_Formal, "cell 0 0,grow");
		
		lbl_Formal = new JLabel("No Formal Selection");
		panel.add(lbl_Formal, "cell 0 1,alignx center");
		
		panel_1 = new JPanel();
		panel_1.setBorder(new TitledBorder(new EtchedBorder(EtchedBorder.LOWERED, new Color(255, 255, 255), new Color(160, 160, 160)), "Circle Selection", TitledBorder.CENTER, TitledBorder.TOP, null, new Color(0, 0, 0)));
		panel_Selections.add(panel_1, "cell 0 1");
		panel_1.setLayout(new MigLayout("", "[200px]", "[180px][20px]"));
		
		panel_Circle = new JPanel();
		panel_1.add(panel_Circle, "cell 0 0,grow");
		
		lbl_Circle = new JLabel("No Circle Selection");
		panel_1.add(lbl_Circle, "cell 0 1,alignx center");
		
		
		this.setVisible(true);
	}
	
	private void loadCurrent()
	{
		current = seniors.current;
		lbl_Ref.setText(current.ref);
		textField_Last.setText(current.last);
		textField_First.setText(current.first);
		textField_ID.setText(current.ID);
		textArea.setText(current.notes);
		lbl_Code.setText("Code: "+current.code);
		
		loadFallThumbnail();
		loadThumbnails();
	}
	public String getCurrentRef()
	{
		return current.ref;
	}
	
	private void loadFallThumbnail()
	{
		panel_FallImg.removeAll();
		imageFile = new File(fallPath+"\\CroppedSmall\\"+current.ref+".jpg");
		if(imageFile.exists())
		{
			try
			{
				BufferedImage stuImage = ImageIO.read(imageFile);
				Image scaledImage = stuImage.getScaledInstance(-1, 250, Image.SCALE_FAST);
				panel_FallImg.add(new JLabel(new ImageIcon(scaledImage)));
				stuImage.flush();
				scaledImage.flush();
				
			}catch(IOException e) {e.printStackTrace();}
		}
		panel_FallImg.updateUI();
	}
	
	private void exportToJson() {
	    Map<String, JSONArray> imageMap = new HashMap<>();
	    for (Senior senior : allSeniors) {
	        String ref = senior.ref;
	        JSONArray imageArray = new JSONArray();
	        
	        String studentDirectory = schoolPath + "//Proofs//";
	        File dir = new File(studentDirectory);
	        if (dir.exists() && dir.isDirectory()) {
	            File[] imageFiles = dir.listFiles((dir1, name) -> name.toLowerCase().startsWith(ref.toLowerCase()) && name.toLowerCase().endsWith(".jpg"));
	            if (imageFiles != null) {
	                for (File imageFile : imageFiles) {
	                    imageArray.put(imageFile.getName());
	                }
	            }
	        }
	        
	        imageMap.put(senior.code, imageArray);
	    }
	    
	    JSONObject jsonObject = new JSONObject(imageMap);
	    
	    try {
	    	PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter(schoolPath+"//Proofs//JSONexport.json",false)));
	    	
	   
	        out.write(jsonObject.toString(4));  // 4 is the number of spaces for indentation
	        System.out.println("JSON file created successfully!");
	        out.close();
	    } catch (IOException e) {
	        e.printStackTrace();
	    }
	}
	
	private void loadThumbnails()
	{
		seniorImageNames = new ArrayList<String>();
		currentSeniorImageIndex=0;
		panel_Thumbnails.removeAll();
		String studentDirectory = schoolPath+"//CroppedMed//";
		File dir = new File(studentDirectory);
		if(dir.exists() && dir.isDirectory())
		{
			File[] imageFiles = dir.listFiles((dir1, name) -> name.toLowerCase().endsWith(".jpg"));
			if(imageFiles !=null)
			{
				for(File imageFile:imageFiles)
				{
					if(imageFile.getName().contains(current.ref))
					{
						seniorImageNames.add(imageFile.getName());
						
						try 
						{
							BufferedImage img = ImageIO.read(imageFile);
							Image scaledImage = img.getScaledInstance(120, -1, Image.SCALE_FAST);
							JLabel picLabel = new JLabel(new ImageIcon(scaledImage));
							picLabel.addMouseListener(new MouseAdapter() {
	                            @Override
	                            public void mouseClicked(MouseEvent e) {
	                                if (e.getClickCount() == 2) {
	                                	save();
	                                    displaySelectedThumbnail(imageFile.getName());
	                                }
	                            }
	                        });
							panel_Thumbnails.add(picLabel);
							img.flush();
						}catch(IOException e) {e.printStackTrace();}
					}
				}
			}
		}
		panel_Thumbnails.revalidate();
		panel_Thumbnails.repaint();
		loadSeniorImage(true);
	}
	
	private void loadSelectedPoses()
	{
		JSONObject ordersJson = null;
		String formalImage = null, circleImage = null; //33, 34
		BufferedImage img;
		Image scaledImage;
		JLabel picLabel;
		
		lbl_Formal.setText("No Formal Selection");
		lbl_Circle.setText("No Circle Selection");
		panel_Formal.removeAll();
		panel_Circle.removeAll();

		
		
        
        // Parse the orders JSON
        try {
            ordersJson = new JSONObject(current.orders);
        } catch (JSONException e) {ordersJson=null;}
        if (ordersJson != null) {
            for (String imageName : seniorImageNames) {
                if (ordersJson.has(imageName) && (ordersJson.get(imageName).toString().contains("33")||ordersJson.get(imageName).toString().contains("63"))) {	formalImage = imageName; }
                if (ordersJson.has(imageName) && (ordersJson.get(imageName).toString().contains("34")||ordersJson.get(imageName).toString().contains("64"))) {	circleImage = imageName; }
            }
        }
        
        try
        {
			if(formalImage!=null) {
				final String finalFormal = formalImage;
				img = ImageIO.read(new File(schoolPath+"//CroppedMed//"+formalImage));
				scaledImage = img.getScaledInstance(100, -1, Image.SCALE_FAST);
				picLabel = new JLabel(new ImageIcon(scaledImage));
				picLabel.addMouseListener(new MouseAdapter() {
                    @Override
                    public void mouseClicked(MouseEvent e) {
                        if (e.getClickCount() == 2) {
                        	save();
                            displaySelectedThumbnail(finalFormal);
                        }
                    }
                });
				
				panel_Formal.add(picLabel);
				panel_Formal.revalidate();
				panel_Formal.repaint();
				img.flush();
				lbl_Formal.setText(formalImage);
			}
			if(circleImage!=null) {
				final String finalCircle = circleImage;
				img = ImageIO.read(new File(schoolPath+"//CroppedMed//"+circleImage));
				scaledImage = img.getScaledInstance(100, -1, Image.SCALE_FAST);
				picLabel = new JLabel(new ImageIcon(scaledImage));
				picLabel.addMouseListener(new MouseAdapter() {
                    @Override
                    public void mouseClicked(MouseEvent e) {
                        if (e.getClickCount() == 2) {
                        	save();
                            displaySelectedThumbnail(finalCircle);
                        }
                    }
                });
				
				panel_Circle.add(picLabel);
				panel_Circle.revalidate();
				panel_Circle.repaint();
				img.flush();
				lbl_Circle.setText(circleImage);
			}

			
        }catch(Exception e) {System.out.println("Error: "+e);}
        
        
	}
	
	private void displaySelectedThumbnail(String imageName)
	{
		for(int i=0;i<seniorImageNames.size();i++)
		{
			if(imageName.equals(seniorImageNames.get(i))) 
			{ 
				currentSeniorImageIndex=i;
				loadSeniorImage(false);
				break;
			}
		}
	}
	
	private void loadSeniorImage(boolean newSenior)
	{
		if(current.orders.equals("")) current.orders = "{}";
		panel_SeniorImg.removeAll();
		if(newSenior)
		{		
	        currentSeniorImageIndex = 0;
	        loadSelectedPoses();
		}   
		
		Collections.sort(seniorImageNames);
		if(seniorImageNames.size()>0)
		{
	        currentSeniorImage = seniorImageNames.get(currentSeniorImageIndex);
			try
			{
				BufferedImage img = ImageIO.read(new File(schoolPath+"//CroppedMed//"+currentSeniorImage));
				Image scaledImage = img.getScaledInstance(280, -1, Image.SCALE_FAST);
				JLabel picLabel = new JLabel(new ImageIcon(scaledImage));
				panel_SeniorImg.add(picLabel);
				img.flush();
			}catch(IOException e) {e.printStackTrace();}
			
			panel_SeniorImg.revalidate();
			panel_SeniorImg.repaint();
			lbl_SeniorImg.setText(currentSeniorImage);
		}
		else lbl_SeniorImg.setText("Senior Image#");
		parseOrders();
		
	}
	private void parseOrders() {
	    if (current == null || current.orders == null || current.orders.isEmpty()) {
	        textField_ImageOrder.setText("");
	        return;
	    }
	    
	    try {
	        JSONObject ordersJson = new JSONObject(current.orders);
	        if (ordersJson.has(currentSeniorImage)) {
	            textField_ImageOrder.setText(ordersJson.get(currentSeniorImage).toString());
	        } else {
	            textField_ImageOrder.setText("");
	        }
	    } catch (JSONException e) {
	        e.printStackTrace();
	        textField_ImageOrder.setText("");
	    }
	}
	private boolean saveOrders()
	{
		
		if (current == null || currentSeniorImage == null) {
	        return false;
	    }
	    
	    boolean needToSave = false;
	    try {
	        JSONObject ordersJson;
	        if (current.orders == null || current.orders.isEmpty()) {
	            ordersJson = new JSONObject();
	        } else {
	            ordersJson = new JSONObject(current.orders);
	        }
	        
	        String newOrder = textField_ImageOrder.getText().trim();
	        if (!newOrder.isEmpty()) {
	            ordersJson.put(currentSeniorImage, newOrder);
	        } else {
	            ordersJson.remove(currentSeniorImage);
	        }
	        
	        String updatedOrderString = ordersJson.toString();
	        if (!updatedOrderString.equals(current.orders)) {
	            current.orders = updatedOrderString;
	            needToSave = true;
	        }
	    } catch (JSONException e) {
	        e.printStackTrace();
	    }
	    
	    return needToSave;
	}
	
	private void save()
	{
		boolean needToSave = false;
		needToSave = saveOrders();
		if(!current.first.equals(textField_First.getText())) {current.first = textField_First.getText().trim();needToSave = true;}
		if(!current.last.equals(textField_Last.getText())) {current.last = textField_Last.getText().trim();needToSave = true;}
		if(!current.ID.equals(textField_ID.getText())) {current.ID = textField_ID.getText().trim();needToSave = true;}
		if(!current.notes.equals(textArea.getText())) {current.notes = textArea.getText().trim();needToSave = true;}
		
		if(needToSave)
		{
			seniors.saveSenior(current);
			seniors.setCurrentSenior(current.ref);
			allSeniors = seniors.getSeniors();
			search();
		}
	}
	
	private void close()
	{
		save();
		seniors.close();
		this.dispose();
		
	}
	
	private void search()
	{
		String value = textField_Search.getText().toUpperCase();
		foundList = new ArrayList<Senior>();
		for(Senior s:allSeniors)
		{
			if(s.last.contains(value)||s.first.contains(value))
			{
				foundList.add(s);
			}
		}
		tempTableArray= new String[foundList.size()][3];
		for(int i=0;i<foundList.size();i++)
		{
			tempTableArray[i][0]=foundList.get(i).ref;
			tempTableArray[i][1]=foundList.get(i).last;
			tempTableArray[i][2]=foundList.get(i).first;
		}
		updateTable();
	}
	
	private void updateTable()
	{
		SwingUtilities.invokeLater(()->{
			model.setRowCount(0);
			for(String[] row: tempTableArray) {
				model.addRow(row);
			}
		});
	}
	
	private void setCurrentSenior(String ref)
	{
		seniors.setCurrentSenior(ref);
		current = seniors.current;
		lbl_Ref.setText(current.ref);
		textField_First.setText(current.first);
		textField_Last.setText(current.last);
		textField_ID.setText(current.ID);
		textArea.setText(current.notes);
		lbl_Code.setText("Code: "+current.code);
	}
	
	private void setupTable()
	{
		table.setModel(model);
		table.addMouseListener(new MouseAdapter(){
			public void mouseClicked(MouseEvent e)
			{
				if(e.getClickCount()==2)
				{
					save();
					setCurrentSenior(tempTableArray[table.getSelectedRow()][0]);
					loadCurrent();
				}
			}
		});
		table.addKeyListener(new KeyAdapter(){
			public void keyPressed(KeyEvent e)
			{
				if((e.getKeyCode()==KeyEvent.VK_ENTER)&&(table.getSelectedRow()!=-1))
				{
					save();
					setCurrentSenior(tempTableArray[table.getSelectedRow()][0]);
					loadCurrent();
				}
			}
		});
		table.setPreferredScrollableViewportSize(new Dimension(400, 180));
		table.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0), "Enter");
		scrollPane_Table = new JScrollPane(table);
	}
	
	private void createSmallCrops()
	{
		JFrame frame = new JFrame("SmallCrops");
		frame.setSize(new Dimension(300,50));
		frame.setVisible(true);
		frame.setResizable(false);
		
		new Thread(new Runnable(){
			public void run(){
				JProgressBar progressBar = new JProgressBar(0,100);
				frame.getContentPane().add(progressBar);
				
				File[] images = (new File(schoolPath+"\\CroppedLarge")).listFiles(new FilenameFilter()
				{
					public boolean accept(File dir, String name) {return name.toUpperCase().endsWith(".JPG");}
				});
				Arrays.sort(images);
				new File(schoolPath+"\\CroppedMed").mkdir();

				for(int i=0;i<images.length;i++)
				{
					progressBar.setValue((i*100)/images.length);
					medImageMaker(images[i]);
				}
				try
				{
					new File(schoolPath+"\\Proofs").mkdir();
					BufferedImage proof = ImageIO.read(new File("Templates\\FALL\\PROOF.png"));
					images = (new File(schoolPath+"\\CroppedMed")).listFiles(new FilenameFilter()
					{
						public boolean accept(File dir, String name) {return name.toUpperCase().endsWith(".JPG");}
					});
					for(int i=0;i<images.length;i++)
					{
						progressBar.setValue((i*100)/images.length);
						BufferedImage img = ImageIO.read(images[i]);
						Image scaled = img.getScaledInstance(320, -1, Image.SCALE_SMOOTH);
						BufferedImage scaledImg = toBufferedImage(scaled,BufferedImage.TYPE_INT_RGB);
						Graphics2D g = scaledImg.createGraphics();
						g.drawImage(proof, 0, 0, null);
						g.dispose();
						ImageIO.write(scaledImg, "jpg", new File(schoolPath+"\\Proofs\\"+images[i].getName()));
					}
					
				}catch(Exception e) {JOptionPane.showMessageDialog(null, "Error: "+e);}
				exportToJson();
				progressBar.setValue(100);
				JOptionPane.showMessageDialog(null, "Complete!");
				frame.dispose();
			}
		}).start();
		System.gc();
	}
	
	private void medImageMaker(File f)
	{
		try{
			int dpi = 300;
			BufferedImage img = ImageIO.read(f);
			
			File outThmb = new File(schoolPath+"\\CroppedMed\\"+f.getName());	
			Image thumbImg = img.getScaledInstance(600, -1, Image.SCALE_SMOOTH);
			
			BufferedImage bufThumb = toBufferedImage(thumbImg,BufferedImage.TYPE_INT_RGB);
			
			ImageWriter imageWriter = ImageIO.getImageWritersBySuffix("jpeg").next();
			ImageOutputStream ios = ImageIO.createImageOutputStream(outThmb);
			imageWriter.setOutput(ios);
			ImageWriteParam jpegParams = imageWriter.getDefaultWriteParam();

			IIOMetadata data = imageWriter.getDefaultImageMetadata(
					new ImageTypeSpecifier(bufThumb), jpegParams);
			
			Element tree = (Element)data.getAsTree("javax_imageio_jpeg_image_1.0");
			Element jfif = (Element)tree.getElementsByTagName("app0JFIF").item(0);
			jfif.setAttribute("Xdensity", Integer.toString(dpi));
			jfif.setAttribute("Ydensity", Integer.toString(dpi));
			jfif.setAttribute("resUnits", "1"); // density is dots per inch                 
			data.mergeTree("javax_imageio_jpeg_image_1.0",tree);
			
			imageWriter.write(data, new IIOImage(bufThumb, null, data), jpegParams);
			ios.close();
			imageWriter.dispose();
			
		}catch(IOException e){JOptionPane.showMessageDialog(null, "Error: "+f.getPath()+" "+e);}
	}

    private static BufferedImage toBufferedImage(Image image, int type) {
        int w = image.getWidth(null);
        int h = image.getHeight(null);
        BufferedImage result = new BufferedImage(w, h, type);
        Graphics2D g = result.createGraphics();
        g.drawImage(image, 0, 0, null);
        g.dispose();
        return result;
    }
	
	@Override
	public void actionPerformed(ActionEvent e) {
		Object pressed = e.getSource();
		
		if(pressed==btnNext)
		{
			save();
			seniors.next();
			loadCurrent();
		}else if(pressed==btnPrevious)
		{
			save();
			seniors.previous();
			loadCurrent();
		}else if(pressed==btn_PreviousImg)
		{
			save();
			if(currentSeniorImageIndex==0) currentSeniorImageIndex = seniorImageNames.size()-1;
			else currentSeniorImageIndex--;
			loadSeniorImage(false);
		}else if(pressed==btn_NextImg)
		{
			save();
			if(currentSeniorImageIndex==seniorImageNames.size()-1) currentSeniorImageIndex=0;
			else currentSeniorImageIndex++;
			loadSeniorImage(false);
			
		}else if(pressed==mntmNewMenuItem)
		{
			close();
			window.add(new SeniorImageDropGUI(window,job,schoolData,seniors,fallPath));
		}else if(pressed==mntmNewMenuItem_1)
		{
			close();
			window.chooseJob();
		}
		else if(pressed==mntmNewMenuItem_2)
		{
			createSmallCrops();
		}		
		else if(pressed==mntmNewMenuItem_4)
		{
			save();
			window.add(new RenderSeniorGUI(seniors,window,schoolPath,job,schoolData,this));
			this.moveToBack();
		}
		else if(pressed==mntmNewMenuItem_5)
		{
			save();
			String temp = current.ref;
	        JFileChooser fileChooser = new JFileChooser();
	        
	        // Set the JFileChooser to only accept JSON files
	        fileChooser.setFileFilter(new javax.swing.filechooser.FileFilter() {
	            @Override
	            public boolean accept(File f) {
	                return f.isDirectory() || f.getName().toLowerCase().endsWith(".json");
	            }

	            @Override
	            public String getDescription() {
	                return "JSON Files (*.json)";
	            }
	        });
	        // Show the open dialog
	        int returnValue = fileChooser.showOpenDialog(null);
	        
	        // Check if the user selected a file
	        if (returnValue == JFileChooser.APPROVE_OPTION) {
	            File selectedFile = fileChooser.getSelectedFile();
	            seniors.loadOnlineOrders(selectedFile);
	            seniors.setCurrentSenior(temp);
	            loadCurrent();
	            JOptionPane.showMessageDialog(null, "All complete", "Completion Status", JOptionPane.INFORMATION_MESSAGE);
	            // Add code here to read/process the JSON file
	        } else {
	            System.out.println("No file selected.");
	        }
			
		}
		else if(pressed==mntmNewMenuItem_6)
		{
			save();
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int val = fc.showOpenDialog(null);
			if(val==JFileChooser.APPROVE_OPTION)
			{
				String outputPath = fc.getSelectedFile().getAbsolutePath();
				seniors.exportSeniorImages(outputPath);
				
				
			}
		}
		else if(pressed==mntmNewMenuItem_7)
		{
			window.add(new ListMakerGUI(seniors, schoolData.schoolName));
			this.moveToBack();
		}
		
	}
}


@SuppressWarnings("serial")
class VerticalLabel extends JLabel {

    public VerticalLabel(String text) {
        super(text);
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2d = (Graphics2D) g.create();

        // Apply anti-aliasing for smoother text
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Rotate 90 degrees counterclockwise
        AffineTransform at = new AffineTransform();
        at.rotate(Math.toRadians(-90));

        // Adjust the x and y position to draw the text correctly
        at.translate(-getHeight(), 0);

        // Set the transform
        g2d.setTransform(at);

        // Draw the text
        g2d.setFont(getFont());
        g2d.setColor(getForeground());
        g2d.drawString(getText(), 0, getFont().getSize());

        g2d.dispose();
    }

    @Override
    public Dimension getPreferredSize() {
        Dimension dim = super.getPreferredSize();
        return new Dimension(dim.height, dim.width);
    }

    
}
class UpcaseFilter2 extends DocumentFilter{
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



