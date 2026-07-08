package photo.software.senior;

import javax.imageio.ImageIO;
import javax.swing.*;
import net.miginfocom.swing.MigLayout;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.login.SchoolData;
import java.awt.*;
import java.awt.dnd.*;
import java.awt.datatransfer.DataFlavor;
import java.awt.event.*;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.ArrayList;
import javax.swing.border.TitledBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.table.DefaultTableModel;
import javax.swing.text.AbstractDocument;
import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;
import javax.swing.text.DocumentFilter;
import javax.swing.border.EtchedBorder;

public class SeniorImageDropGUI extends JInternalFrame implements ActionListener
{

	private static final long serialVersionUID = 1L;
	
	private JMenuBar menuBar;
	private JMenu mnNewMenu;
	private JMenuItem mntmNewMenuItem;
	
	private JPanel panel_FallImg, panel_Thumbnails, panel_Search, panel_Drop, panel_Table;
	private JScrollPane scrollPane_1;
	
	private JLabel lbl_Last, lbl_First, lbl_Search, lbl_Ref;
	private JButton btn_Previous, btn_Next;
	private JTextField textField_search;

	private DesktopWindow window;
	private JobData job;
	private SchoolData schoolData;
	private Seniors seniors;
	private Senior current;
	private int currentIndex;
	private String fallPath, schoolPath;
	private File imageFile;

	private JTable table;
	private DefaultTableModel model;
	private String[] columnNames = {"Reference","Last","First"};
	private String[][] tempTableArray;	
	private ArrayList<Senior> foundList, allSeniors;


	public SeniorImageDropGUI(DesktopWindow window, JobData job, SchoolData schoolData, Seniors seniors, String fallPath) {
		
		this.window = window;
		this.job = job;
		this.schoolData = schoolData;
		this.seniors = seniors;
		this.fallPath = fallPath;
		schoolPath = window.jobs+"\\"+job.location+"\\"+job.job;
		allSeniors = seniors.getSeniors();
		seniors.close();
		currentIndex=0;
		current = allSeniors.get(currentIndex);
		initialize();
		loadCurrent();
		search();

	}
	
	@SuppressWarnings("serial")
	private void initialize()
	{
		UpcaseFilter upper = new UpcaseFilter();
		setBounds(100, 100, 900, 650);
		this.setLocation(0,0);
		this.setVisible(true);
		getContentPane().setLayout(new MigLayout("", "[340px][360px][160px]", "[225px][340px][200px]"));
		
		JPanel infoPanel = new JPanel();
		getContentPane().add(infoPanel, "cell 0 0,grow");
		infoPanel.setLayout(new MigLayout("", "[150px][150px]", "[50px][50px][150px][50px]"));
		
		lbl_Ref = new JLabel("Reference #");
		lbl_Ref.setFont(new Font("Tahoma", Font.PLAIN, 18));
		infoPanel.add(lbl_Ref, "cell 0 1");
		
		lbl_Last = new JLabel("Last");
		lbl_Last.setFont(new Font("Tahoma", Font.PLAIN, 18));
		infoPanel.add(lbl_Last, "cell 0 2");
		
		lbl_First = new JLabel("First");
		lbl_First.setFont(new Font("Tahoma", Font.PLAIN, 18));
		infoPanel.add(lbl_First, "cell 1 2");
		
		btn_Previous = new JButton("Previous");
		btn_Previous.setFont(new Font("Tahoma", Font.PLAIN, 16));
		btn_Previous.addActionListener(this);
		infoPanel.add(btn_Previous, "cell 0 4,growx");
		
		btn_Next = new JButton("Next");
		btn_Next.setFont(new Font("Tahoma", Font.PLAIN, 16));
		btn_Next.addActionListener(this);
		infoPanel.add(btn_Next, "cell 1 4,growx");
		
		lbl_Search = new JLabel("Search:");
		
		panel_FallImg = new JPanel();
		getContentPane().add(panel_FallImg, "cell 1 0 1 2");
		
		panel_Thumbnails = new JPanel();
		panel_Thumbnails.setLayout(new BoxLayout(panel_Thumbnails, BoxLayout.Y_AXIS));
		JScrollPane scrollPaneThumbnailes = new JScrollPane(panel_Thumbnails);
		scrollPaneThumbnailes.setPreferredSize(new Dimension(140,400));
		scrollPaneThumbnailes.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);
		scrollPaneThumbnailes.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
		getContentPane().add(scrollPaneThumbnailes, "cell 2 0 1 2,grow");
		
		panel_Search = new JPanel();
		getContentPane().add(panel_Search, "cell 0 1,grow");
		
		panel_Search.add(lbl_Search, "flowx,cell 0 0,alignx trailing");
		textField_search = new JTextField();
		textField_search.getDocument().addDocumentListener(new DocumentListener() {
			  public void changedUpdate(DocumentEvent e) {
					search();
			  }
			  public void removeUpdate(DocumentEvent e) {
					search();
			  }
			  public void insertUpdate(DocumentEvent e) {
					search();
			  }});
		panel_Search.add(textField_search, "cell 1 0,growx");
		textField_search.setColumns(15);
		((AbstractDocument) textField_search.getDocument()).setDocumentFilter(upper);
		
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
		
		scrollPane_1 = new JScrollPane(table);
		panel_Table.add(scrollPane_1);
		
		panel_Drop = new JPanel();
		panel_Drop.setBorder(new TitledBorder(
				new EtchedBorder(EtchedBorder.LOWERED, new Color(255, 255, 255), new Color(160, 160, 160)), 
				"Image Drop", TitledBorder.CENTER, TitledBorder.TOP, null, new Color(0, 0, 0)));
		getContentPane().add(panel_Drop, "cell 0 2 3 1,grow");
		
		new DropTarget(panel_Drop, new DropTargetAdapter() {
		    @Override
		    public void drop(DropTargetDropEvent dtde) {
		        try {
		            dtde.acceptDrop(DnDConstants.ACTION_COPY);
		            @SuppressWarnings("unchecked")
		            List<File> droppedFiles = (List<File>) dtde.getTransferable().getTransferData(DataFlavor.javaFileListFlavor);
		            handleFileDrop(droppedFiles);
		            dtde.dropComplete(true);
		        } catch (Exception e) {
		            e.printStackTrace();
		        }
		    }
		});
		
		menuBar = new JMenuBar();
		setJMenuBar(menuBar);
		
		mnNewMenu = new JMenu("File");
		menuBar.add(mnNewMenu);
		
		mntmNewMenuItem = new JMenuItem("Close");
		mntmNewMenuItem.addActionListener(this);
		mnNewMenu.add(mntmNewMenuItem);
		
	}
	
	private void search()
	{
		String value = textField_search.getText().toUpperCase();
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
		for(int i=0;i<allSeniors.size();i++)
		{
			if(allSeniors.get(i).ref.equals(ref))
			{
				currentIndex = i;
				current = allSeniors.get(i);
			}
		}
	}
	
	private void setupTable()
	{
		table.setModel(model);
		table.addMouseListener(new MouseAdapter(){
			public void mouseClicked(MouseEvent e)
			{
				if(e.getClickCount()==2)
				{
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
					setCurrentSenior(tempTableArray[table.getSelectedRow()][0]);
					loadCurrent();
				}
			}
		});
		table.setPreferredScrollableViewportSize(new Dimension(300, 200));
		table.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0), "Enter");
		scrollPane_1 = new JScrollPane(table);
	}
	
	private void loadCurrent()
	{
		lbl_Ref.setText(current.ref);
		lbl_Last.setText(current.last);
		lbl_First.setText(current.first);
		loadThumbnail();
		loadThumbnails();

	}
	
	private void loadThumbnail()
	{
		panel_FallImg.removeAll();
		imageFile = new File(fallPath+"\\CroppedSmall\\"+current.ref+".jpg");
		if(imageFile.exists())
		{
			try
			{
				BufferedImage stuImage = ImageIO.read(imageFile);
				Image scaledImage = stuImage.getScaledInstance(340, -1, Image.SCALE_FAST);
				panel_FallImg.add(new JLabel(new ImageIcon(scaledImage)));
				stuImage.flush();
				scaledImage.flush();
				
			} catch(IOException e) {e.printStackTrace();}
		}
		panel_FallImg.updateUI();
	}


	
	private void handleFileDrop(List<File> files) {
	    Frame parentFrame = window.getParentFrame();
	    BatchProgressDialog progressBarDialog = new BatchProgressDialog(parentFrame);
	    SwingUtilities.invokeLater(() -> progressBarDialog.setVisible(true));

	    SwingWorker<Void, Integer> worker = new SwingWorker<Void, Integer>() {
	        @Override
	        protected Void doInBackground() throws Exception {
	            long totalSize = 0;
	            long totalProcessed = 0;

	            // Calculate total size of both JPG and RAW files
	            for (File file : files) {
	                totalSize += Files.size(file.toPath());
	            }

	            // Process each file
	            for (File file : files) {
	                try {
	                    // Create destination path
	                    String studentDirectory = schoolPath + "//Images//" + current.ref + "//";
	                    Path directoryPath = Paths.get(studentDirectory);
	                    if (!Files.exists(directoryPath)) {
	                        Files.createDirectories(directoryPath);
	                    }
	                    Path destinationPath = directoryPath.resolve(current.ref + "_" + file.getName());

	                    // Copy file directly for RAW or unsupported formats
	                    try (InputStream in = new BufferedInputStream(Files.newInputStream(file.toPath()));
	                         OutputStream out = new BufferedOutputStream(Files.newOutputStream(destinationPath))) {
	                        byte[] buffer = new byte[1024];
	                        int bytesRead;
	                        while ((bytesRead = in.read(buffer)) != -1) {
	                            out.write(buffer, 0, bytesRead);
	                            totalProcessed += bytesRead;
	                            int progress = (int) ((totalProcessed * 100) / totalSize);
	                            publish(progress);
	                        }
	                    }

	                } catch (IOException e) {
	                    //System.err.println("Error processing file: " + file.getAbsolutePath() + " - " + e.getMessage());
	                }
	            }

	            return null;
	        }

	        @Override
	        protected void process(List<Integer> chunks) {
	            int latestProgress = chunks.get(chunks.size() - 1);
	            progressBarDialog.updateProgress(latestProgress);
	        }

	        @Override
	        protected void done() {
	            progressBarDialog.dispose();
	            loadThumbnails();  // Only updates thumbnails of JPG images
	        }
	    };

	    worker.execute();
	}





	
	/*
	private void handleFileDrop(File file)
	{
		try 
		{	
			String studentDirectory = schoolPath+"//Images//" + current.ref + "//";
            Path directoryPath = Paths.get(studentDirectory);
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
            }
            Path destinationPath = directoryPath.resolve(current.ref+"_"+file.getName());
            Files.copy(file.toPath(), destinationPath);
            loadThumbnails();
            
		} catch(Exception e) 
		{
			e.printStackTrace();
		}
	}*/
	
	private void loadThumbnails()
	{
		panel_Thumbnails.removeAll();
		String studentDirectory = schoolPath+"//Images//" + current.ref + "//";
		File dir = new File(studentDirectory);
		if(dir.exists() && dir.isDirectory())
		{
			File[] imageFiles = dir.listFiles((dir1, name) -> name.toLowerCase().endsWith(".jpg"));
			if(imageFiles !=null)
			{
				for(File imageFile:imageFiles)
				{
					try {
					BufferedImage img = ImageIO.read(imageFile);
					if(isHorizontal(img)) img = rotateImage(img,270);
					Image scaledImage = img.getScaledInstance(120, -1, Image.SCALE_FAST);
					JLabel picLabel = new JLabel(new ImageIcon(scaledImage));
					panel_Thumbnails.add(picLabel);
					img.flush();
					}catch(IOException e) {e.printStackTrace();}
				}
			}
		}
		panel_Thumbnails.revalidate();
		panel_Thumbnails.repaint();
	}
	
	
	private void close()
	{
		window.add(new SeniorGUI(window,job,schoolData,seniors));
		this.dispose();
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		Object pressed = e.getSource();
		if(pressed==btn_Previous)
		{
			if(currentIndex==0) currentIndex = allSeniors.size()-1;
			else currentIndex--;
			current = allSeniors.get(currentIndex);
			loadCurrent();
		}
		else if(pressed==btn_Next)
		{
			if(currentIndex==allSeniors.size()-1) currentIndex=0;
			else currentIndex++;
			current = allSeniors.get(currentIndex);
			loadCurrent();
		}
		else if(pressed==mntmNewMenuItem)
		{
			close();
		}
		
	}
	
	
	private BufferedImage rotateImage(BufferedImage img, int angle) {
	    int width = img.getWidth();
	    int height = img.getHeight();
	    int newWidth = height;
	    int newHeight = width;
	    BufferedImage rotatedImage = new BufferedImage(newWidth, newHeight, img.getType());
	    Graphics2D g2d = rotatedImage.createGraphics();
	    g2d.translate((newWidth - width) / 2, (newHeight - height) / 2);
	    g2d.rotate(Math.toRadians(angle), width / 2, height / 2);
	    g2d.drawRenderedImage(img, null);
	    g2d.dispose();
	    return rotatedImage;
	}

	private boolean isHorizontal(BufferedImage img) {
	    return img.getWidth() > img.getHeight();
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

@SuppressWarnings("serial")
class BatchProgressDialog extends JDialog {
    private JProgressBar progressBar;

    public BatchProgressDialog(Frame owner) {
        super(owner, "Batch File Transfer Progress", true);
        progressBar = new JProgressBar(0, 100);
        progressBar.setValue(0);
        progressBar.setStringPainted(true);
        add(progressBar, BorderLayout.CENTER);
        setSize(300, 75);
        setLocationRelativeTo(owner);
    }

    public void updateProgress(int progress) {
        progressBar.setValue(progress);
    }
}
