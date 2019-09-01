import React, { useCallback, useState } from 'react';
import cx from 'classnames';
import moment from 'moment';
import s from './index.module.scss';
import { useDropzone } from 'react-dropzone';
import filesize from 'filesize';
import {
  compressDataURL,
  decompressDataURL,
  downloadDataURL
} from '../../plugins/dataURL';
import {
  getInLocal,
  getUniqueKey,
  saveInLocal
} from '../../plugins/localstorage';
import Logo from '../Logo';
import Upload from '../Upload';
import avatar from '../../images/avatar.png';
import search from '../../images/search.svg';
import img from '../../images/img.svg';
import pdf from '../../images/pdf.svg';
import doc from '../../images/doc.svg';
import other from '../../images/other.svg';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import {
  deleteFile,
  pushFile,
  toggleFavorite
} from '../../store/actions/rootActions';
import Popover from '@material-ui/core/Popover';
import { Icon } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';

function Homepage() {
  const dispatch = useDispatch();
  const onDrop = useCallback(
    acceptedFiles => {
      acceptedFiles.forEach(file => {
        const reader = new FileReader();

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = async () => {
          // Do whatever you want with the file contents
          console.log(file);

          const dataURL = reader.result;

          const key = getUniqueKey();

          const { header, body: compressed } = await compressDataURL(dataURL);

          const result = saveInLocal(key, compressed);
          if (result) {
            dispatch(
              pushFile({
                key,
                header,
                name: file.name,
                updateAt: file.lastModified,
                type: file.type,
                size: compressed.length * 2,
                isFavorite: false,
                isPDF: file.type === 'application/pdf',
                isDoc: file.type === 'application/msword',
                isImg: /image\//.test(file.type)
              })
            );
          } else {
            setOpen(true);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [dispatch]
  );
  const [type, setType] = useState('all');
  const [input, setInput] = useState(null);
  const [open, setOpen] = useState(false);
  const remainSpace = useSelector(state => state.root.remainSpace);
  const usageSpace = useSelector(state => state.root.usageSpace);
  const files = useSelector(state => state.root.files);
  const totalSpace = remainSpace + usageSpace;
  const ratio = (usageSpace / totalSpace) * 100;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [active, setActive] = React.useState(null);

  const handleMoreClick = key => event => {
    setAnchorEl(event.currentTarget);
    setActive(key);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActive(null);
  };

  const onDownload = async () => {
    const target = files.find(file => file.key === active);
    if (target) {
      const dataURL = await decompressDataURL(
        target.header,
        getInLocal(target.key)
      );
      downloadDataURL(dataURL, target.name, target.type);
      handleClose();
    }
  };

  const onFavorite = () => {
    dispatch(toggleFavorite(active));
    handleClose();
  };

  const onDelete = () => {
    localStorage.removeItem(active);
    dispatch(deleteFile(active));
    handleClose();
  };

  return (
    <div className={s.root}>
      <div className={s.navBar}>
        <div className={s.logo}>
          <Logo size={30} />
          <span>MCloud.</span>
        </div>
        <div {...getRootProps()} className={s.dropzone}>
          <input {...getInputProps()} />
          <div className={s.dropzone_text}>
            <Upload />
            {isDragActive ? <span>Drop here</span> : <span>上傳檔案</span>}
          </div>
          <span className={s.message}>將壓縮並儲存於 localstorage 中</span>
        </div>
        <div className={s.menu}>
          <div
            className={cx(s.menu_row, { [s.menu_row_active]: type === 'all' })}
            onClick={() => setType('all')}
          >
            <Icon>folder</Icon>
            <span>我的檔案</span>
          </div>
          <div
            className={cx(s.menu_row, { [s.menu_row_active]: type === 'star' })}
            onClick={() => setType('star')}
          >
            <Icon>star_border</Icon>
            <span>已加星號</span>
          </div>
        </div>
        <div className={s.user}>
          <div className={s.user_row}>
            <div
              className={s.avatar}
              style={{ backgroundImage: `url('${avatar}')` }}
            />
            <div className={s.user_detail}>
              <span className={s.username}>Jennifer</span>
              <span>User</span>
            </div>
          </div>
          <div className={s.user_row}>
            <div className={s.progress}>
              <span style={{ width: `${ratio}%` }} />
            </div>
          </div>
          <div className={s.user_row}>
            <span className={s.size}>
              <b>容量 {filesize(usageSpace)}</b> / {filesize(totalSpace)}
            </span>
          </div>
        </div>
      </div>
      <div className={s.container}>
        <div className={s.search}>
          <div className={s.search_icon}>
            <img src={search} alt="search" />
          </div>
          <input
            className={s.search_input}
            value={input}
            placeholder="搜尋您的檔案"
            onChange={e => setInput(e.target.value)}
          />
          <span className={s.search_arrow} />
        </div>
        <div className={s.content}>
          <div className={s.header}>
            <span>
              <b>{type === 'all' ? '我的檔案' : '已加星號'}</b>
            </span>
          </div>
          <Table className={s.table}>
            <TableHead>
              <TableRow>
                <TableCell className={s.cell}>名稱</TableCell>
                <TableCell className={s.cell} align="right">
                  上次修改
                </TableCell>
                <TableCell className={s.cell} align="right">
                  檔案大小
                </TableCell>
                <TableCell className={s.cell} align="right">
                  擁有者
                </TableCell>
                <TableCell className={s.cell} align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {files
                .filter(file => (type === 'star' ? file.isFavorite : true))
                .filter(file => (input ? RegExp(input).test(file.name) : true))
                .map(row => (
                  <TableRow className={s.row} key={row.key}>
                    <TableCell className={s.cell} component="th" scope="row">
                      {row.isImg && <img src={img} alt="img" />}
                      {row.isPDF && <img src={pdf} alt="pdf" />}
                      {row.isDoc && <img src={doc} alt="doc" />}
                      {!row.isImg && !row.isPDF && !row.isDoc && (
                        <img src={other} alt="other" />
                      )}
                      {row.name}
                      {row.isFavorite && (
                        <Icon style={{ color: '#FFBA00' }}>star</Icon>
                      )}
                    </TableCell>
                    <TableCell className={s.cell} align="right">
                      {moment(row.updateAt).fromNow()}
                    </TableCell>
                    <TableCell className={s.cell} align="right">
                      {filesize(row.size)}
                    </TableCell>
                    <TableCell className={s.cell} align="right">
                      Jennifer
                    </TableCell>
                    <TableCell className={s.cell} align="right">
                      <button
                        className={s.more}
                        onClick={handleMoreClick(row.key)}
                      >
                        <Icon>more_horiz</Icon>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <div className={s.more_list}>
              <span onClick={onDownload}>下載</span>
              <span onClick={onFavorite}>標示星號</span>
              <span>重新命名</span>
              <span onClick={onDelete}>刪除</span>
            </div>
          </Popover>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            open={open}
            autoHideDuration={6000}
            onClose={(e, reason) => {
              if (reason === 'clickaway') {
                return;
              }
              setOpen(false);
            }}
            ContentProps={{
              'aria-describedby': 'message-id'
            }}
            message={<span id="message-id">檔案太大，已超過儲存上限</span>}
          />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
