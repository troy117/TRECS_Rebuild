package photo.software.QRevent;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;

import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JTextField;

import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Hashtable;
import java.util.Scanner;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JFileChooser;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.JScrollPane;
import javax.swing.JMenuBar;
import javax.swing.JMenu;
import javax.swing.JMenuItem;
import javax.swing.KeyStroke;

import photo.software.QRevent.render.QRRenderGUI;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;
import photo.software.student.Student;
import photo.software.student.Students;

import javax.swing.JComboBox;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.table.DefaultTableModel;
import javax.swing.text.AbstractDocument;
import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;
import javax.swing.text.DocumentFilter;
import javax.swing.border.TitledBorder;
import javax.swing.JTextArea;

import org.apache.commons.io.FileUtils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

@SuppressWarnings("serial")
public class QREventGUI extends JInternalFrame implements ActionListener {
	private DesktopWindow window;
	public JobData job, fallJob;
	private QRstudents students;
	private ArrayList<Student> fallStudents, foundList;
	private QRRenderGUI renderGUI = null;

	public String schoolName, schoolPath, website;
	private ArrayList<String> homerooms, fallHomerooms;

	private QRstudent current;

	private JMenuItem mntmAddBlankRecords, mntmLoadImageFolder,
			mntmRenderImage, mntmClose;

	private JLabel lblRef, lblImage;

	private JTextField textField, textField_1, textField_2;
	private JComboBox<String> comboBox, comboBox_1;
	private JButton btnPrevious, btnNext, btnSave;

	private JPanel panel_1;
	private File imageFile;
	private JLabel thumbLabel;
	private BufferedImage stuImage;
	private Image resizedImage;

	private JLabel searchLabel;

	private JPanel panel_3;
	private JScrollPane scrollPane, scrollPane_1;
	private JTable table, table_1;
	private DefaultTableModel model, model_1;
	private String[] columnNames = { "Reference", "Image", "First", "Last",
			"Homeroom", "Order" };
	private String[] columnNames_1 = { "Reference", "First", "Last",
			"Homeroom", "Grade" };
	private String[][] tempTableArray, tempTableArray_1;
	private int selectedRow = -1;

	public ArrayList<QRstudent> allStudents;
	private JPanel panel_4;
	private JLabel lblSearch;
	private JPanel panel_5;
	private JTextField textField_3;
	private JLabel lblCategory;
	private JPanel panel_6;
	private JLabel lblSearch_1;
	private JTextField textField_4;
	private String fallPath;
	private JTextArea textArea;
	private JMenuItem mntmQreventSheet;
	private JMenuItem mntmOutputEncodedImages;

	public QREventGUI(DesktopWindow window, JobData job, QRstudents students) {
		this.window = window;
		this.job = job;
		this.students = students;
		allStudents = students.getStudents();
		this.schoolName = job.location;
		schoolPath = window.jobs + "\\" + job.location + "\\" + job.job;
		fallStudents = new ArrayList<Student>();
		initialize();

		current = null;
		if (students.size() > 0) {
			current = students.setCurrentStudent(job.refNum);
			loadCurrent();
		}
		initializeComboBoxes();
		updateTableArray();
		updateTable();

		if (!students.fallPath.equals("")) {
			panel_6.setVisible(true);
			fallPath = students.fallPath;
			website = students.website;
			openFallDatabase(students.fallPath);
			updateTableArray_1();
			updateTable_1();
			textField_3.setEnabled(true);
		}
	}

	private boolean openFallDatabase(String fallPath) {
		fallStudents = new ArrayList<Student>();
		Students fall = new Students(fallPath + "\\Database\\Students.accdb");
		if (fall.openStudentDatabase()) {
			fallStudents = fall.getStudents();
			fallHomerooms = new ArrayList<String>();
			for (Student s : fallStudents) {
				if (!fallHomerooms.contains(s.homeroom))
					fallHomerooms.add(s.homeroom);
			}
			fall.close();
			return true;
		}
		return false;
	}

	public boolean updateDatabase(ArrayList<QRstudent> toAdd) {
		return students.addStudents(toAdd);
	}

	private void loadCurrent() {
		current = students.current;
		lblRef.setText(job.location + "    " + job.job + "    Ref #: "
				+ current.ref);
		lblImage.setText("Image #: " + current.image);
		textField.setText(current.first);
		textField_1.setText(current.last);
		comboBox.setSelectedItem(current.homeroom);
		textField_2.setText(current.order);
		textArea.setText(current.notes);
		loadThumbnail();
		if (selectedRow != -1)
			table.setRowSelectionInterval(selectedRow, selectedRow);
	}

	public boolean updateFromOrderForm(QRstudent formStudent) {
		if (current.ref.equals(formStudent.ref)) {
			textField.setText(formStudent.first);
			textField_1.setText(formStudent.last);
			textField_2.setText(formStudent.order);
			textArea.setText(formStudent.notes);
			saveCurrent(true);
			return true;
		} else
			JOptionPane.showMessageDialog(null,
					"EventGUI student does not match OrderFormGUI student");
		return false;
	}

	private void saveCurrent() {
		saveCurrent(false);
	}

	private void saveCurrent(boolean override) {
		boolean needToSave = false;
		boolean updateComboBoxes = false;
		if (table.getSelectedRow() != -1)
			selectedRow = table.getSelectedRow();
		if (!current.first.equals(textField.getText().trim())) {
			current.first = textField.getText().trim();
			needToSave = true;
		}
		if (!current.last.equals(textField_1.getText().trim())) {
			current.last = textField_1.getText().trim();
			needToSave = true;
		}
		if (!current.homeroom.equals(((String) comboBox.getSelectedItem())
				.trim())) {
			current.homeroom = ((String) comboBox.getSelectedItem()).trim();
			needToSave = true;
			updateComboBoxes = true;
		}
		if (!current.order.equals(textField_2.getText().trim())) {
			current.order = textField_2.getText().trim();
			needToSave = true;
		}
		if (!current.notes.equals(textArea.getText().trim())) {
			current.notes = textArea.getText().trim();
			needToSave = true;
		}
		if (needToSave || override) {
			students.saveStudent(current);
			students.setCurrentStudent(current.ref);
			if (updateComboBoxes)
				initializeComboBoxes();
			if (textField_4.getText().equals("")) {
				model.setValueAt(current.first, students.currentIndex, 2);
				model.setValueAt(current.last, students.currentIndex, 3);
				model.setValueAt(current.homeroom, students.currentIndex, 4);
				model.setValueAt(current.order, students.currentIndex, 5);
			} else {
				searchTable();
				updateTable();
				if (selectedRow > -1 && selectedRow < allStudents.size())
					table.setRowSelectionInterval(selectedRow, selectedRow);
			}
		}
	}

	private void loadThumbnail() {
		imageFile = new File(schoolPath + "\\Images\\" + current.image);
		panel_1.removeAll();
		if (imageFile.exists()) {
			try {
				stuImage = ImageIO.read(imageFile);
				resizedImage = stuImage.getScaledInstance(300, -1,
						Image.SCALE_FAST);
				thumbLabel = new JLabel(new ImageIcon(resizedImage));
				panel_1.add(thumbLabel);
				stuImage.flush();
				resizedImage.flush();
			} catch (Exception e) {
				JOptionPane.showMessageDialog(null, "Error Displaying Image: "
						+ e);
			}
		}
		panel_1.updateUI();

	}

	private void initializeComboBoxes() {
		homerooms = new ArrayList<String>();
		homerooms.add("");
		for (QRstudent s : students.getStudents()) {
			if (!homerooms.contains(s.homeroom))
				homerooms.add(s.homeroom);
		}
		Collections.sort(homerooms);
		comboBox.removeAllItems();
		for (String h : homerooms)
			comboBox.addItem(h);

	}

	private void updateTableArray() {
		tempTableArray = new String[allStudents.size()][6];
		for (int i = 0; i < allStudents.size(); i++) {
			tempTableArray[i][0] = allStudents.get(i).ref;
			tempTableArray[i][1] = allStudents.get(i).image;
			tempTableArray[i][2] = allStudents.get(i).first;
			tempTableArray[i][3] = allStudents.get(i).last;
			tempTableArray[i][4] = allStudents.get(i).homeroom;
			tempTableArray[i][5] = allStudents.get(i).order;
		}
	}

	public ArrayList<QRstudent> getSelectedStudents() {
		ArrayList<QRstudent> selectedStudents = new ArrayList<QRstudent>();

		for (int i : table.getSelectedRows())
			selectedStudents.add(allStudents.get(i));
		return selectedStudents;
	}

	private void updateTable() {
		model = new DefaultTableModel(tempTableArray, columnNames) {
			@Override
			public boolean isCellEditable(int row, int column) {
				return false;
			}
		};
		table = new JTable(model);
		table.addMouseListener(new MouseAdapter() {
			public void mouseClicked(MouseEvent e) {
				if (e.getClickCount() == 2) {
					saveCurrent();
					current = students.setCurrentStudent(tempTableArray[table
							.getSelectedRow()][0]);
					loadCurrent();
				}
			}
		});
		table.addKeyListener(new KeyAdapter() {
			public void keyPressed(KeyEvent e) {
				if ((e.getKeyCode() == KeyEvent.VK_ENTER)
						&& (table.getSelectedRow() != -1)) {
					saveCurrent();
					current = students.setCurrentStudent(tempTableArray[table
							.getSelectedRow()][0]);
					loadCurrent();
					table.setRowSelectionInterval(selectedRow, selectedRow + 1);
				}
			}
		});
		table.setPreferredScrollableViewportSize(new Dimension(660, 200));
		table.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(
				KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0), "Enter");

		panel_3.removeAll();
		scrollPane = new JScrollPane(table);
		panel_3.add(scrollPane);
		scrollPane.updateUI();
		panel_3.updateUI();
	}

	private void updateTableArray_1() {
		tempTableArray_1 = new String[fallStudents.size()][5];
		for (int i = 0; i < fallStudents.size(); i++) {
			tempTableArray_1[i][0] = fallStudents.get(i).ref;
			tempTableArray_1[i][1] = fallStudents.get(i).first;
			tempTableArray_1[i][2] = fallStudents.get(i).last;
			tempTableArray_1[i][3] = fallStudents.get(i).homeroom;
			tempTableArray_1[i][4] = fallStudents.get(i).grade;
		}
	}

	private void updateTable_1() {
		model_1 = new DefaultTableModel(tempTableArray_1, columnNames_1) {
			@Override
			public boolean isCellEditable(int row, int column) {
				return false;
			}
		};
		table_1 = new JTable(model_1);
		table_1.addMouseListener(new MouseAdapter() {
			public void mousePressed(MouseEvent e) {
				updateSearchPicture(tempTableArray_1[table_1.getSelectedRow()][0]);
			}

			public void mouseClicked(MouseEvent e) {
				if (e.getClickCount() == 2) {
					textField.setText(tempTableArray_1[table_1.getSelectedRow()][1]);
					textField_1.setText(tempTableArray_1[table_1
							.getSelectedRow()][2]);
					comboBox.setSelectedItem(tempTableArray_1[table_1
							.getSelectedRow()][3]);
				}
			}
		});
		table_1.addKeyListener(new KeyAdapter() {
			public void keyPressed(KeyEvent e) {
				if ((e.getKeyCode() == KeyEvent.VK_ENTER)
						&& (table.getSelectedRow() != -1)) {
					textField.setText(tempTableArray_1[table_1.getSelectedRow()][1]);
					textField_1.setText(tempTableArray_1[table_1
							.getSelectedRow()][2]);
					comboBox.setSelectedItem(tempTableArray_1[table_1
							.getSelectedRow()][3]);
				}
			}
		});
		table_1.setPreferredScrollableViewportSize(new Dimension(660, 200));
		table_1.getInputMap(JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT).put(
				KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0), "Enter");

		panel_4.removeAll();
		scrollPane_1 = new JScrollPane(table_1);
		panel_4.add(scrollPane_1);
		panel_4.updateUI();
	}

	private void updateSearchPicture(String ref) {
		panel_5.removeAll();
		panel_5.repaint();
		File thumbFile = new File(fallPath + "\\CroppedSmall\\" + ref + ".JPG");
		if (thumbFile.exists()) {
			try {
				searchLabel = new JLabel(new ImageIcon(ImageIO.read(thumbFile)
						.getScaledInstance(200, -1, Image.SCALE_FAST)));
				panel_5.add(searchLabel);
			} catch (Exception e) {
				JOptionPane.showMessageDialog(null,
						"Error Displaying Search Thumb: " + e);
			}
			panel_5.repaint();
		}
		panel_5.updateUI();
	}

	private void searchTable() {
		String value = textField_4.getText();
		allStudents = new ArrayList<QRstudent>();
		for (QRstudent s : students.getStudents()) {
			if (s.first.contains(value) || s.last.contains(value))
				allStudents.add(s);
		}
		updateTableArray();
	}

	private void searchTable_1() {
		String value = textField_3.getText();
		foundList = new ArrayList<Student>();

		switch (comboBox_1.getSelectedIndex()) {
		case 0:
			for (Student s : fallStudents)
				if (s.first.contains(value))
					foundList.add(s);
			break;
		case 1:
			for (Student s : fallStudents)
				if (s.last.contains(value))
					foundList.add(s);
			break;
		case 2:
			for (Student s : fallStudents)
				if (s.homeroom.contains(value))
					foundList.add(s);
			break;
		}

		tempTableArray_1 = new String[foundList.size()][5];
		for (int i = 0; i < foundList.size(); i++) {
			tempTableArray_1[i][0] = foundList.get(i).ref;
			tempTableArray_1[i][1] = foundList.get(i).first;
			tempTableArray_1[i][2] = foundList.get(i).last;
			tempTableArray_1[i][3] = foundList.get(i).homeroom;
			tempTableArray_1[i][4] = foundList.get(i).grade;
		}
	}

	private void initialize() {
		UpcaseFilter upper = new UpcaseFilter();
		setBounds(100, 100, 1050, 1050);
		getContentPane().setLayout(
				new MigLayout("", "[700.00][321.00,grow]",
						"[550.00][384.00,grow]"));

		JPanel panel = new JPanel();
		getContentPane().add(panel, "cell 0 0,grow");
		panel.setLayout(new MigLayout("", "[200,grow][200,grow][200][100]",
				"[][][][][][][][81.00,grow][][grow]"));

		lblRef = new JLabel(job.location + "    " + job.job + "    Ref #: ");
		lblRef.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(lblRef, "cell 0 0 4 1");

		lblImage = new JLabel("Image #");
		lblImage.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(lblImage, "cell 0 1 4 1");

		textField = new JTextField();
		((AbstractDocument) textField.getDocument()).setDocumentFilter(upper);
		textField.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(textField, "cell 0 3,growx");
		textField.setColumns(10);

		textField_1 = new JTextField();
		((AbstractDocument) textField_1.getDocument()).setDocumentFilter(upper);
		textField_1.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(textField_1, "cell 1 3,growx");
		textField_1.setColumns(10);

		comboBox = new JComboBox<String>();
		((AbstractDocument) ((JTextField) comboBox.getEditor()
				.getEditorComponent()).getDocument()).setDocumentFilter(upper);
		comboBox.setEditable(true);
		comboBox.addItem("");
		comboBox.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(comboBox, "cell 2 3,growx");

		textField_2 = new JTextField();
		((AbstractDocument) textField_2.getDocument()).setDocumentFilter(upper);
		textField_2.setFont(new Font("Tahoma", Font.PLAIN, 18));
		panel.add(textField_2, "cell 3 3,growx");
		textField_2.setColumns(10);

		JLabel lblFirst = new JLabel("First");
		lblFirst.setFont(new Font("Tahoma", Font.PLAIN, 14));
		panel.add(lblFirst, "cell 0 4,alignx center,aligny top");

		JLabel lblLast = new JLabel("Last");
		lblLast.setFont(new Font("Tahoma", Font.PLAIN, 14));
		panel.add(lblLast, "cell 1 4,alignx center,aligny top");

		JLabel lblHomeroom = new JLabel("Homeroom");
		lblHomeroom.setFont(new Font("Tahoma", Font.PLAIN, 14));
		panel.add(lblHomeroom, "cell 2 4,alignx center,aligny top");

		btnPrevious = new JButton("Previous");
		btnPrevious.addActionListener(this);

		JLabel lblPackage = new JLabel("Package");
		lblPackage.setFont(new Font("Tahoma", Font.PLAIN, 14));
		panel.add(lblPackage, "cell 3 4,alignx center,aligny top");
		panel.add(btnPrevious, "cell 0 5,growx");

		btnNext = new JButton("Next");
		btnNext.addActionListener(this);
		panel.add(btnNext, "cell 1 5,growx");

		btnSave = new JButton("Save");
		btnSave.addActionListener(this);
		panel.add(btnSave, "cell 2 5,growx");

		textField_4 = new JTextField();
		((AbstractDocument) textField_4.getDocument()).setDocumentFilter(upper);
		textField_4.getDocument().addDocumentListener(new DocumentListener() {
			public void changedUpdate(DocumentEvent e) {
				searchTable();
				updateTable();
			}

			public void removeUpdate(DocumentEvent e) {
				searchTable();
				updateTable();
			}

			public void insertUpdate(DocumentEvent e) {
				searchTable();
				updateTable();
			}
		});

		textArea = new JTextArea();
		panel.add(textArea, "cell 0 7 3 1,grow");

		lblSearch_1 = new JLabel("Search:");
		panel.add(lblSearch_1, "cell 0 8,alignx trailing");
		panel.add(textField_4, "cell 1 8,growx");
		textField_4.setColumns(10);

		panel_3 = new JPanel();
		panel.add(panel_3, "cell 0 9 4 1");

		panel_1 = new JPanel();
		getContentPane().add(panel_1, "cell 1 0,grow");

		panel_6 = new JPanel();
		panel_6.setVisible(false);
		panel_6.setBorder(new TitledBorder(null, "Search Fall Data",
				TitledBorder.CENTER, TitledBorder.TOP, null, null));
		getContentPane().add(panel_6, "cell 0 1 2 1,grow");
		panel_6.setLayout(new MigLayout("", "[700.00][321.00,grow]",
				"[36.00][287.00,grow]"));

		JPanel panel_2 = new JPanel();
		panel_6.add(panel_2, "cell 0 0,grow");
		panel_2.setLayout(new MigLayout("", "[90.00][121.00][89.00][140.00]",
				"[]"));

		lblSearch = new JLabel("Search:");
		panel_2.add(lblSearch, "cell 0 0,alignx trailing");

		textField_3 = new JTextField();
		((AbstractDocument) textField_3.getDocument()).setDocumentFilter(upper);
		textField_3.setEnabled(false);
		textField_3.getDocument().addDocumentListener(new DocumentListener() {
			public void changedUpdate(DocumentEvent e) {
				searchTable_1();
				updateTable_1();
			}

			public void removeUpdate(DocumentEvent e) {
				searchTable_1();
				updateTable_1();
			}

			public void insertUpdate(DocumentEvent e) {
				searchTable_1();
				updateTable_1();
			}
		});
		panel_2.add(textField_3, "cell 1 0,growx");
		textField_3.setColumns(10);

		lblCategory = new JLabel("Category:");
		panel_2.add(lblCategory, "cell 2 0,alignx trailing");

		comboBox_1 = new JComboBox<String>();
		comboBox_1.addItem("First Name");
		comboBox_1.addItem("Last Name");
		comboBox_1.addItem("Homeroom");
		panel_2.add(comboBox_1, "cell 3 0,growx");

		panel_5 = new JPanel();
		panel_6.add(panel_5, "cell 1 0 1 2,grow");

		panel_4 = new JPanel();
		panel_6.add(panel_4, "cell 0 1,grow");

		scrollPane_1 = new JScrollPane();

		panel_4.add(scrollPane_1);

		table_1 = new JTable();
		scrollPane_1.setViewportView(table_1);

		JMenuBar menuBar = new JMenuBar();
		setJMenuBar(menuBar);

		JMenu mnFile = new JMenu("File");
		menuBar.add(mnFile);

		mntmAddBlankRecords = new JMenuItem("Add Blank Records");
		mntmAddBlankRecords.addActionListener(this);
		mnFile.add(mntmAddBlankRecords);

		mntmQreventSheet = new JMenuItem("Print QREvent Sheet");
		mntmQreventSheet.addActionListener(this);
		mnFile.add(mntmQreventSheet);

		mntmLoadImageFolder = new JMenuItem("Load Image Folder");
		mntmLoadImageFolder.addActionListener(this);
		mnFile.add(mntmLoadImageFolder);

		mntmClose = new JMenuItem("Close");
		mntmClose.addActionListener(this);

		mntmRenderImage = new JMenuItem("Render Images");
		mntmRenderImage.addActionListener(this);

		mnFile.add(mntmRenderImage);

		mntmOutputEncodedImages = new JMenuItem("Output Encoded Images");
		mntmOutputEncodedImages.addActionListener(this);
		mnFile.add(mntmOutputEncodedImages);
		mnFile.add(mntmClose);
		this.setVisible(true);
	}

	public void close() {
		saveCurrent();
		students.close();
		this.dispose();
	}

	private void addBlankRecords() {
		int c = 0;
		String count = JOptionPane.showInputDialog(null,
				"How Many Blank Records? ");
		try {
			c = Integer.parseInt(count);
		} catch (NumberFormatException e) {
			JOptionPane.showMessageDialog(null, "Not a valid Number.");
		}
		students.addBlank(c);
		textField_4.setText(" ");
		textField_4.setText("");
	}

	@Override
	public void actionPerformed(ActionEvent arg0) {
		Object pressed = arg0.getSource();
		if (pressed == btnPrevious) {
			saveCurrent();
			students.previous();
			loadCurrent();
		} else if (pressed == btnNext) {
			saveCurrent();
			students.next();
			loadCurrent();
		} else if (pressed == btnSave) {
			saveCurrent();
			loadCurrent();
		} else if (pressed == mntmAddBlankRecords) {
			saveCurrent();
			addBlankRecords();
		} else if (pressed == mntmLoadImageFolder) {
			saveCurrent();
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int returnVal = fc.showOpenDialog(null);
			if (returnVal == JFileChooser.APPROVE_OPTION) {
				window.add(new QREventPhotoChooser(fc.getSelectedFile(),
						fallHomerooms, this));
				this.moveToBack();
			}
		} else if (pressed == mntmQreventSheet) {
			saveCurrent();
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int returnVal = fc.showOpenDialog(null);
			if (returnVal == JFileChooser.APPROVE_OPTION) {
				renderQREventSheets(fc.getSelectedFile().getAbsolutePath());
			}
		} else if (pressed == mntmRenderImage) {
			if (renderGUI != null)
				try {
					renderGUI.dispose();
				} catch (Exception e) {
				}
			renderGUI = new QRRenderGUI(this);
			window.add(renderGUI);
			this.moveToBack();
		} else if (pressed == mntmOutputEncodedImages) {
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int returnVal = fc.showOpenDialog(null);
			if (returnVal == JFileChooser.APPROVE_OPTION) {
				outputEncodedImages(fc.getSelectedFile().getAbsolutePath());
			}
		}

		else if (pressed == mntmClose) {
			close();
			window.chooseJob();
		}
	}

	public void sendLinkData(String[][] tableData) {
		try {
			for (int i = 0; i < tableData.length; i++) {
				if (!students.updateImage(tableData[i][0], tableData[i][1],
						tableData[i][2])) {
					JOptionPane.showMessageDialog(null, "Unable to udpate: "
							+ tableData[i][0] + " " + tableData[i][1]);
				}
			}

			PrintWriter link = new PrintWriter(new BufferedWriter(
					new FileWriter(schoolPath + "\\link.txt", true)));
			for (int i = 0; i < tableData.length; i++) {
				link.println(tableData[i][0] + "\t" + tableData[i][1] + "\t"
						+ tableData[i][2]);
			}
			link.close();
		} catch (Exception e) {
			JOptionPane.showMessageDialog(null, "Error: " + e);
		}

	}

	private void outputEncodedImages(String output) {
		ArrayList<QRstudent> outputStudents = students.getStudents();
		File copy, paste;
		for (QRstudent s : outputStudents) {
			try {
				copy = new File(schoolPath + "\\Images\\" + s.image);
				paste = new File(output + "\\" + s.rand + ".jpg");
				if (s.image != "" && copy.exists()) {
					FileUtils.copyFile(copy, paste);
				}
			} catch (Exception e) {
			}
		}
	}

	private void renderQREventSheets(String output) {
		String planLine;
		String[] p;
		int qrX = 0, qrY = 0, qrW = 0, numberX = 0, numberY = 0, numberS = 0, number2X = 0, number2Y = 0, linkX = 0, linkY = 0, linkS = 0;
		int ref;
		String numberF = "", linkF = "";
		BufferedImage background, template;
		FontMetrics fm;
		Graphics2D g;
		try {
			File planFile = new File("Templates\\PACKAGE_PLANS\\QREvent.txt");
			if (planFile.exists()) {
				Scanner planScan = new Scanner(planFile);
				while (planScan.hasNext()) {
					planLine = planScan.nextLine();
					p = planLine.split("\t");
					if (p[0].contains("QR Image X:"))
						qrX = Integer.parseInt(p[1]);
					else if (p[0].contains("QR Image Y:"))
						qrY = Integer.parseInt(p[1]);
					else if (p[0].contains("QR Width:"))
						qrW = Integer.parseInt(p[1]);
					else if (p[0].contains("Number Center X:"))
						numberX = Integer.parseInt(p[1]);
					else if (p[0].contains("Number Bottom Y:"))
						numberY = Integer.parseInt(p[1]);
					else if (p[0].contains("Number Size:"))
						numberS = Integer.parseInt(p[1]);
					else if (p[0].contains("Number Font:"))
						numberF = p[1];
					else if (p[0].contains("Number2 Center X:"))
						number2X = Integer.parseInt(p[1]);
					else if (p[0].contains("Number2 Bottom Y:"))
						number2Y = Integer.parseInt(p[1]);
					else if (p[0].contains("Link Center X:"))
						linkX = Integer.parseInt(p[1]);
					else if (p[0].contains("Link Bottom Y:"))
						linkY = Integer.parseInt(p[1]);
					else if (p[0].contains("Link Size:"))
						linkS = Integer.parseInt(p[1]);
					else if (p[0].contains("Link Font:"))
						linkF = p[1];
				}
				planScan.close();
				template = ImageIO.read(new File(schoolPath
						+ "\\Templates\\QRtemplate.jpg"));
				background = new BufferedImage(template.getWidth(),
						template.getHeight(), BufferedImage.TYPE_INT_RGB);
				g = background.createGraphics();
				allStudents = students.getStudents();
				g.setColor(Color.black);
				for (QRstudent s : allStudents) {
					g.setFont(new Font(numberF, Font.PLAIN, numberS));
					fm = g.getFontMetrics();

					g.drawImage(template, 0, 0, null);
					g.drawImage(createQRImage(website + s.rand + ".jpg", qrW),
							qrX, qrY, null);

					ref = Integer.parseInt(s.ref);
					ref = ref % 1000;

					g.drawString(ref + "", numberX - fm.stringWidth(ref + "")
							/ 2, numberY);
					g.drawString(ref + "", number2X - fm.stringWidth(ref + "")
							/ 2, number2Y);

					g.setFont(new Font(linkF, Font.PLAIN, linkS));
					fm = g.getFontMetrics();

					g.drawString(website + s.rand + ".jpg",
							linkX - fm.stringWidth(website + s.rand + ".jpg")
									/ 2, linkY);

					ImageIO.write(background, "jpg", new File(output + "\\"
							+ ref + ".jpg"));
				}
				JOptionPane.showMessageDialog(null, "DONE!");
			}

		} catch (Exception e) {
			JOptionPane.showMessageDialog(null,
					"Error Loading QREvent Settings: " + e);
		}

	}

	private static BufferedImage createQRImage(String qrCodeText, int size) {

		BufferedImage image = null;
		try {
			// Create the ByteMatrix for the QR-Code that encodes the given
			// String
			Hashtable<EncodeHintType, ErrorCorrectionLevel> hintMap = new Hashtable<EncodeHintType, ErrorCorrectionLevel>();
			hintMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
			QRCodeWriter qrCodeWriter = new QRCodeWriter();
			BitMatrix byteMatrix;

			byteMatrix = qrCodeWriter.encode(qrCodeText, BarcodeFormat.QR_CODE,
					size, size, hintMap);

			// Make the BufferedImage that are to hold the QRCode
			int matrixWidth = byteMatrix.getWidth();
			image = new BufferedImage(matrixWidth, matrixWidth,
					BufferedImage.TYPE_INT_RGB);
			image.createGraphics();

			Graphics2D graphics = (Graphics2D) image.getGraphics();
			graphics.setColor(Color.WHITE);
			graphics.fillRect(0, 0, matrixWidth, matrixWidth);
			// Paint and save the image using the ByteMatrix
			graphics.setColor(Color.BLACK);

			for (int i = 0; i < matrixWidth; i++) {
				for (int j = 0; j < matrixWidth; j++) {
					if (byteMatrix.get(i, j)) {
						graphics.fillRect(i, j, 1, 1);
					}
				}
			}
		} catch (WriterException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return image;
	}
}

class UpcaseFilter extends DocumentFilter {
	public void insertString(DocumentFilter.FilterBypass fb, int offset,
			String text, AttributeSet attr) throws BadLocationException {
		fb.insertString(offset, text.toUpperCase(), attr);
	}

	// no need to override remove(): inherited version allows all removals

	public void replace(DocumentFilter.FilterBypass fb, int offset, int length,
			String text, AttributeSet attr) throws BadLocationException {
		fb.replace(offset, length, text.toUpperCase(), attr);
	}
}
