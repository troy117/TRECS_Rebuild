package photo.software.league;

import java.awt.Dimension;
import java.awt.Image;

import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JPanel;
import javax.swing.JLabel;

import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.ImageIcon;
import javax.swing.JComponent;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.JComboBox;
import javax.swing.JButton;
import javax.swing.JTable;
import javax.swing.KeyStroke;
import javax.swing.table.DefaultTableModel;
import javax.swing.text.AbstractDocument;
import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;
import javax.swing.text.DocumentFilter;

import photo.software.event.DuplicateGUI;
import photo.software.league.folder.ChooseLeagueImageFolder;
import photo.software.league.folder.LoadLeagueImageFolder;
import photo.software.league.render.RenderLeagueGUI;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;

import javax.swing.JMenuBar;
import javax.swing.JMenu;
import javax.swing.JMenuItem;

@SuppressWarnings("serial")
public class LeagueGUI extends JInternalFrame  implements ActionListener
{
	private DesktopWindow window;
	public JobData job;
	private LeaguePlayers players;
	public String schoolName, schoolPath;
	private LeaguePlayer current;
	private DuplicateGUI duplicate = null;
	private RenderLeagueGUI renderLeagueGUI= null;
	private ArrayList<LeaguePlayer> allPlayers;
	private ArrayList<String> teams;
	
	
	
	private JLabel lblRef, lblImage;
	private JTextField textField,textField_1,textField_2;
	private JComboBox<String> comboBox;
	private JButton btnPrevious, btnNext, btnSave, btnDuplicate;
	
	private JPanel panel_tabel;
	private JScrollPane scrollPane;
	private JTable table;
	private DefaultTableModel model;
	private String[] columnNames = {"Reference","Image","Name1","Name2","Team","Order"};
	private String[][] tempTableArray;
	private int selectedRow = -1;
	
	private JPanel panel_image;
	private File imageFile;
	private JLabel thumbLabel;
	private BufferedImage stuImage;
	private Image resizedImage;
	private JMenuBar menuBar;
	private JMenu mnFile;
	private JMenuItem mntmChooseImageFolder;
	private JMenuItem mntmLoadImageFolder;
	private JMenuItem mntmRenderImages;
	private JMenuItem mntmClose;
	private JLabel lblSchool_1;
	private JLabel lblLeague_1;
	


	public LeagueGUI(DesktopWindow window, JobData job, LeaguePlayers players) 
	{
		this.window = window;
		this.job = job;
		this.players = players;
		this.schoolName = window.jobs;
		
		schoolPath = window.jobs+"\\"+job.location+"\\"+job.job;
		initialize();
		
		current = null;
		if(players.size()>0)
		{
			current = this.players.setCurrentPlayer(job.refNum);
			loadCurrent();
		}
		initializeComboBox();
		updateTableArray();
		updateTable();
	}
	public boolean updateDatabase(ArrayList<LeaguePlayer> toAdd)
	{
		return players.addPlayer(toAdd);
	}
	private void loadCurrent()
	{
		current = players.current;
		lblRef.setText("Ref #: "+current.ref);
		lblImage.setText("Image #: "+current.image);
		textField.setText(current.name1);
		textField_1.setText(current.name2);
		comboBox.setSelectedItem(current.team);
		textField_2.setText(current.order);
		loadThumbnail();
		if(selectedRow!=-1)table.setRowSelectionInterval(selectedRow, selectedRow);
	}
	private void saveCurrent()
	{
		boolean needToSave = false;
		boolean updateComboBoxes = false;
		if(table.getSelectedRow()!=-1) selectedRow = table.getSelectedRow();
		if(!current.name1.equals(textField.getText().trim())){current.name1 = textField.getText().trim();needToSave = true;}
		if(!current.name2.equals(textField_1.getText().trim())){current.name2 = textField_1.getText().trim();needToSave = true;}
		if(!current.team.equals(((String)comboBox.getSelectedItem()).trim()))
		{
			current.team = ((String)comboBox.getSelectedItem()).trim();needToSave = true;
			updateComboBoxes = true;
		}
		if(!current.order.equals(textField_2.getText().trim())){current.order = textField_2.getText().trim();needToSave = true;}
		if(needToSave)
		{
			players.savePlayer(current);
			players.setCurrentPlayer(current.ref);
			if(updateComboBoxes) initializeComboBox();
			{
				model.setValueAt(current.name1, players.currentIndex, 2);
				model.setValueAt(current.name2, players.currentIndex, 3);
				model.setValueAt(current.team, players.currentIndex, 4);
				model.setValueAt(current.order, players.currentIndex, 5);
			}
		}
	}
	private void loadThumbnail()
	{
		imageFile = new File(schoolPath+"\\Images\\"+current.image);
		panel_image.removeAll();
		if(imageFile.exists())
		{
			try
			{
				stuImage = ImageIO.read(imageFile);
				resizedImage = stuImage.getScaledInstance(300, -1, Image.SCALE_FAST);
				thumbLabel = new JLabel(new ImageIcon(resizedImage));
				panel_image.add(thumbLabel);
				stuImage.flush();
				resizedImage.flush();
			}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Displaying Image: "+e);}
		}
		panel_image.updateUI();
	}
	private void initializeComboBox()
	{
		teams = new ArrayList<String>();
		teams.add("");
		for(LeaguePlayer p:players.getPlayers())
		{
			if(!teams.contains(p.team)) teams.add(p.team);
		}
		Collections.sort(teams);
		comboBox.removeAllItems();
		for(String t:teams) comboBox.addItem(t);
	}
	private void updateTableArray()
	{
		allPlayers = players.getPlayers();
		tempTableArray = new String[allPlayers.size()][6];
		for(int i=0;i<allPlayers.size();i++)
		{
			tempTableArray[i][0] = allPlayers.get(i).ref;
			tempTableArray[i][1] = allPlayers.get(i).image;
			tempTableArray[i][2] = allPlayers.get(i).name1;
			tempTableArray[i][3] = allPlayers.get(i).name2;
			tempTableArray[i][4] = allPlayers.get(i).team;
			tempTableArray[i][5] = allPlayers.get(i).order;
		}
	}
	public ArrayList<LeaguePlayer> getPlayers()
	{
		allPlayers = players.getPlayers();
		return allPlayers;
	}
	
	private void initialize()
	{
		UpcaseFilter upper = new UpcaseFilter();
		setBounds(100, 100, 1101, 666);
		getContentPane().setLayout(new MigLayout("", "[720.00][351.00]", "[grow]"));
		
		JPanel panel = new JPanel();
		getContentPane().add(panel, "cell 0 0,grow");
		panel.setLayout(new MigLayout("", "[180.00][180.00][225.00][114.00]", "[][][][][][][grow]"));
		
		lblRef = new JLabel("Ref #:");
		lblRef.setFont(new Font("Tahoma", Font.PLAIN, 20));
		panel.add(lblRef, "cell 0 0");
		
		lblSchool_1 = new JLabel("School: "+job.location);
		lblSchool_1.setFont(new Font("Tahoma", Font.PLAIN, 20));
		panel.add(lblSchool_1, "cell 2 0 2 1");
		
		lblImage = new JLabel("Image #:");
		lblImage.setFont(new Font("Tahoma", Font.PLAIN, 20));
		panel.add(lblImage, "cell 0 1");
		
		textField = new JTextField();
		((AbstractDocument) textField.getDocument()).setDocumentFilter(upper);
		
		lblLeague_1 = new JLabel("League: "+job.job);
		lblLeague_1.setFont(new Font("Tahoma", Font.PLAIN, 20));
		panel.add(lblLeague_1, "cell 2 1 2 1");
		

		textField.setFont(new Font("Tahoma", Font.PLAIN, 20));
		panel.add(textField, "cell 0 3,growx");
		textField.setColumns(10);
		
		textField_1 = new JTextField();
		((AbstractDocument) textField_1.getDocument()).setDocumentFilter(upper);
		textField_1.setFont(new Font("Tahoma", Font.PLAIN, 20));
		panel.add(textField_1, "cell 1 3,growx");
		textField_1.setColumns(10);
		
		comboBox = new JComboBox<String>();
		((AbstractDocument) ((JTextField) comboBox.getEditor().getEditorComponent()).getDocument()).setDocumentFilter(upper);
		comboBox.setEditable(true);
		comboBox.setFont(new Font("Tahoma", Font.PLAIN, 20));
		panel.add(comboBox, "cell 2 3,growx");
		
		textField_2 = new JTextField();
		((AbstractDocument) textField_2.getDocument()).setDocumentFilter(upper);
		textField_2.setFont(new Font("Tahoma", Font.PLAIN, 20));
		panel.add(textField_2, "cell 3 3,growx");
		textField_2.setColumns(10);
		
		JLabel lblName = new JLabel("Name1");
		lblName.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblName, "cell 0 4,alignx center");
		
		JLabel lblName_1 = new JLabel("Name2");
		lblName_1.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblName_1, "cell 1 4,alignx center");
		
		JLabel lblTeam = new JLabel("Team");
		lblTeam.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblTeam, "cell 2 4,alignx center");
		
		JLabel lblPackage = new JLabel("Package");
		lblPackage.setFont(new Font("Tahoma", Font.PLAIN, 16));
		panel.add(lblPackage, "cell 3 4,alignx center");
		
		btnPrevious = new JButton("Previous");
		btnPrevious.addActionListener(this);
		panel.add(btnPrevious, "cell 0 5,growx");
		
		btnNext = new JButton("Next");
		btnNext.addActionListener(this);
		panel.add(btnNext, "cell 1 5,growx");
		
		btnSave = new JButton("Save");
		btnSave.addActionListener(this);
		panel.add(btnSave, "cell 2 5,growx");
		
		btnDuplicate = new JButton("Duplicate");
		btnDuplicate.addActionListener(this);
		panel.add(btnDuplicate, "cell 3 5,growx");
		
		panel_tabel = new JPanel();
		panel.add(panel_tabel, "cell 0 6 4 1,grow");
		
		table = new JTable();
		panel_tabel.add(table);
		
		panel_image = new JPanel();
		getContentPane().add(panel_image, "cell 1 0,grow");
		
		menuBar = new JMenuBar();
		setJMenuBar(menuBar);
		
		mnFile = new JMenu("File");
		menuBar.add(mnFile);
		
		mntmChooseImageFolder = new JMenuItem("Choose Image Folder");
		mntmChooseImageFolder.addActionListener(this);
		mnFile.add(mntmChooseImageFolder);
		
		mntmLoadImageFolder = new JMenuItem("Load Image Folder");
		mntmLoadImageFolder.addActionListener(this);
		mnFile.add(mntmLoadImageFolder);
		
		mntmRenderImages = new JMenuItem("Render Images");
		mntmRenderImages.addActionListener(this);
		mnFile.add(mntmRenderImages);
		
		mntmClose = new JMenuItem("Close");
		mntmClose.addActionListener(this);
		mnFile.add(mntmClose);
		
		
		
		this.setVisible(true);
	}
	
	public void addDuplicateImage(LeaguePlayer p)
	{
		players.addDuplicatePlayerImage(p);
		updateTableArray();
		updateTable();
	}
	public void close()
	{
		if(duplicate!=null)try{duplicate.dispose();}catch(Exception e){}
		saveCurrent();
		players.close();
		this.dispose();
	}
	private void updateTable()
	{
		model = new DefaultTableModel(tempTableArray,columnNames){
			@Override
			public boolean isCellEditable(int row, int column){
				return false;
			}
		};
		table = new JTable(model);
		table.addMouseListener(new MouseAdapter(){
			public void mouseClicked(MouseEvent e)
			{
				if(e.getClickCount()==2)
				{
					saveCurrent();
					current = players.setCurrentPlayer(tempTableArray[table.getSelectedRow()][0]);
					loadCurrent();
				}
			}
		});
		table.addKeyListener(new KeyAdapter(){
			public void keyPressed(KeyEvent e)
			{
				if((e.getKeyCode()==KeyEvent.VK_ENTER)&&(table.getSelectedRow()!=-1))
				{
					saveCurrent();
					current = players.setCurrentPlayer(tempTableArray[table.getSelectedRow()][0]);
					loadCurrent();
					table.setRowSelectionInterval(selectedRow, selectedRow+1);
				}
			}
		});
		table.setPreferredScrollableViewportSize(new Dimension(685, 400));
		table.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0), "Enter");
		
		panel_tabel.removeAll();
		scrollPane = new JScrollPane(table);
		panel_tabel.add(scrollPane);
		scrollPane.updateUI();
		panel_tabel.updateUI();
	}
	@Override
	public void actionPerformed(ActionEvent arg0) 
	{
		
		Object pressed = arg0.getSource();
		if(pressed == btnPrevious)
		{
			saveCurrent();
			players.previous();
			loadCurrent();
		}
		else if(pressed == btnNext)
		{
			saveCurrent();
			players.next();
			loadCurrent();
		}
		else if(pressed == btnSave)
		{
			saveCurrent();
			loadCurrent();
		}
		else if(pressed == btnDuplicate)
		{
			saveCurrent();
			
			if(duplicate!=null)try{duplicate.dispose();}catch(Exception e){}
			duplicate = new DuplicateGUI(teams,current.image,this);
			window.add(duplicate);
			this.moveToBack();
		}
		else if(pressed==mntmChooseImageFolder)
		{
			new ChooseLeagueImageFolder(players.getLastRefNum());
		}
		else if(pressed== mntmLoadImageFolder)
		{
			saveCurrent();
			new LoadLeagueImageFolder(job,this,schoolPath);
			initializeComboBox();
			updateTableArray();
			updateTable();
		}
		else if(pressed==mntmRenderImages)
		{
			
			if(renderLeagueGUI!=null)try{renderLeagueGUI.dispose();}catch(Exception e){}
			renderLeagueGUI = new RenderLeagueGUI(this);
			window.add(renderLeagueGUI);
			this.moveToBack();
			
		}
		else if(pressed==mntmClose)
		{
			close();
			window.chooseJob();
		}
		
	}
	public ArrayList<LeaguePlayer> getSelectedPlayers() 
	{
		ArrayList<LeaguePlayer> selectedPlayers = new ArrayList<LeaguePlayer>();
		
		for(int i:table.getSelectedRows()) selectedPlayers.add(allPlayers.get(i));
		return selectedPlayers;
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
