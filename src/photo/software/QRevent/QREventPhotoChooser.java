package photo.software.QRevent;

import java.awt.Image;

import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.ImageIcon;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.JPanel;
import javax.swing.JButton;
import javax.swing.JTextField;
import javax.swing.JLabel;

import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.io.File;
import java.io.FileFilter;
import java.util.ArrayList;

import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JComboBox;
import javax.swing.JScrollPane;

@SuppressWarnings("serial")
public class QREventPhotoChooser extends JInternalFrame implements ActionListener{
	private JTable table;
	private JTextField textField;
	private JComboBox<String> comboBox;
	private String[][] tableData;
	private int currentIndex = 0;
	private JPanel panel;
	private File[] images;
	private JMenuItem mntmSaveExit;
	private JButton btnNext;
	private QREventGUI eventGUI;
	private JScrollPane scrollPane;

	public QREventPhotoChooser(File imageFolder, ArrayList<String> homerooms, QREventGUI eventGUI) 
	{
		this.eventGUI = eventGUI;
		images = imageFolder.listFiles(new FileFilter(){
			public boolean accept(File arg0) {
				if(arg0.getName().toUpperCase().endsWith(".JPG")) return true;
				return false;
			}});
		tableData = new String[images.length][3];
		for(int i=0;i<images.length;i++)
		{
			tableData[i][0] = images[i].getName();
			tableData[i][1] = "";
			tableData[i][2] = "";
		}
		initialize();
		for(String h:homerooms) comboBox.addItem(h);
		loadCurrentInfo();

	}

	private void initialize()
	{
		
		setBounds(100, 100, 877, 725);
		getContentPane().setLayout(new MigLayout("", "[167.00][238.00][80.00][310.00]", "[477.00][][][]"));
		
		panel = new JPanel();
		getContentPane().add(panel, "cell 0 0 2 1,grow");
		
		String[] tableHeader = {"Image","Number","Homeroom"};
		
		scrollPane = new JScrollPane();
		getContentPane().add(scrollPane, "cell 3 0,grow");
		
		table = new JTable(tableData, tableHeader);
		scrollPane.setViewportView(table);
		
		table.addMouseListener(new MouseListener(){

			@Override
			public void mouseClicked(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mouseEntered(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mouseExited(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void mousePressed(MouseEvent mouseEvent) {
		        JTable table =(JTable) mouseEvent.getSource();

		        if (mouseEvent.getClickCount() == 2 && table.getSelectedRow() != -1) {
		            saveInfo();
		        	currentIndex= table.getSelectedRow();
		            loadCurrentInfo();
					textField.requestFocus();
					textField.selectAll();
		        }
		    }

			@Override
			public void mouseReleased(MouseEvent arg0) {
				// TODO Auto-generated method stub
				
			}});
		
		JLabel lblImageNumber = new JLabel("Image Number:");
		lblImageNumber.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblImageNumber, "flowx,cell 0 1,alignx left");
		
		textField = new JTextField();
		textField.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(textField, "cell 1 1,growx");
		textField.setColumns(10);
		textField.addActionListener(this);
		
		JLabel lblHomeroom = new JLabel("Homeroom:");
		lblHomeroom.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(lblHomeroom, "flowx,cell 0 2");
		
		comboBox = new JComboBox<String>();
		comboBox.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(comboBox, "cell 1 2,growx");
		
		btnNext = new JButton("Next");
		btnNext.addKeyListener(new KeyListener(){

			@Override
			public void keyPressed(KeyEvent arg0) {
				if(arg0.getKeyCode()==KeyEvent.VK_ENTER)
				{
					nextImage();
				}
			}

			@Override
			public void keyReleased(KeyEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void keyTyped(KeyEvent arg0) {
				// TODO Auto-generated method stub
				
			}});
		btnNext.addActionListener(this);
		btnNext.setFont(new Font("Tahoma", Font.PLAIN, 16));
		getContentPane().add(btnNext, "cell 1 3,growx");
		
		JMenuBar menuBar = new JMenuBar();
		setJMenuBar(menuBar);
		
		mntmSaveExit = new JMenuItem("Save & Exit");
		mntmSaveExit.addActionListener(this);
		menuBar.add(mntmSaveExit);
		this.setVisible(true);
		this.setClosable(true);
		
	}
	private void loadCurrentInfo()
	{
		try{
			panel.removeAll();
			panel.add(new JLabel(new ImageIcon(ImageIO.read(images[currentIndex]).getScaledInstance(300,-1,Image.SCALE_FAST))));
			panel.repaint();
			panel.updateUI();
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error: "+e);}
	}
	private void saveInfo()
	{
		tableData[currentIndex][1] = textField.getText();
		tableData[currentIndex][2] = (String)comboBox.getSelectedItem();
		updateTable();
	}
	private void updateTable()
	{
		table.setValueAt(tableData[currentIndex][1], currentIndex, 1);
		table.setValueAt(tableData[currentIndex][2], currentIndex, 2);
	}
	private void nextImage()
	{
		saveInfo();
		currentIndex++;
		if(currentIndex>=tableData.length) currentIndex = 0;
		loadCurrentInfo();
		
	}
	@Override
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		if(pressed==textField)
		{
			nextImage();
			textField.selectAll();
		}else if(pressed==btnNext)
		{
			nextImage();
			textField.requestFocus();
			textField.selectAll();

		}
		else if(pressed == mntmSaveExit)
		{
			saveInfo();
			eventGUI.sendLinkData(tableData);
			this.dispose();
		}
	}
}
