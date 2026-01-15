import{j as t,m as u,I as p,b as g,T as h}from"./iframe-Ca4Oq2uP.js";import{r as x}from"./plugin-DNPqNNBT.js";import{S as l,u as c,a as S}from"./useSearchModal-COgi9hBO.js";import{B as m}from"./Button-lNm9l9il.js";import{a as M,b as C,c as f}from"./DialogTitle-DcpjkfLf.js";import{B as j}from"./Box-C6YthH4K.js";import{S as n}from"./Grid-DvRbNd4W.js";import{S as y}from"./SearchType-BqpGtNCS.js";import{L as I}from"./List-_jXEyBxC.js";import{H as B}from"./DefaultResultListItem-D0g81DzO.js";import{s as D,M as G}from"./api-Dcx0nsvn.js";import{S as R}from"./SearchContext-DY7bisxQ.js";import{w as T}from"./appWrappers-DhOSUPKL.js";import{SearchBar as k}from"./SearchBar-BvRBp6Ou.js";import{a as v}from"./SearchResult-B7vykseq.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cw7rIkuX.js";import"./Plugin-Gf4U2wcG.js";import"./componentData-CRvdRyiq.js";import"./useAnalytics-BO6qv_N6.js";import"./useApp-CIEu2n9t.js";import"./useRouteRef-BGRvnXy4.js";import"./index-CWD4-Z7Q.js";import"./ArrowForward-CTfGuzv6.js";import"./translation-DBeXrFAJ.js";import"./Page-fG8-TlpK.js";import"./useMediaQuery-Be7CXmob.js";import"./Divider-I0xPhLEa.js";import"./ArrowBackIos-CvJFtxZ4.js";import"./ArrowForwardIos-CnlXP9uH.js";import"./translation-Bbralr3K.js";import"./Modal-DNybagJK.js";import"./Portal-DfnbqdYt.js";import"./Backdrop-B0S7DZUH.js";import"./styled-bS2mVuuT.js";import"./ExpandMore-BYyl-nAO.js";import"./useAsync-DQa5qi3g.js";import"./useMountedState-am8g5938.js";import"./AccordionDetails-C-jAEpJA.js";import"./index-B9sM2jn7.js";import"./Collapse-B_fsMJ0G.js";import"./ListItem-BrncrmWC.js";import"./ListContext-DFKFAB0C.js";import"./ListItemIcon-DdMdcQLM.js";import"./ListItemText-VT7wc13t.js";import"./Tabs-DkJxCDdu.js";import"./KeyboardArrowRight-BACK-pVo.js";import"./FormLabel-Zj9aN-y3.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CN-8BnS9.js";import"./InputLabel-BKLbZaDc.js";import"./Select-BbOGwYZT.js";import"./Popover-C2h9W_Jp.js";import"./MenuItem-mA5hVKuu.js";import"./Checkbox-BlA4gZUM.js";import"./SwitchBase-CfRPubEc.js";import"./Chip-DaqKdLaz.js";import"./Link-C9Yjpk8V.js";import"./lodash-DLuUt6m8.js";import"./useObservable-D5OlgkuN.js";import"./useIsomorphicLayoutEffect-D_xlHkKu.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BpyxVR22.js";import"./useDebounce-Oh0bJ6R-.js";import"./InputAdornment-CYWlqqw5.js";import"./TextField-CTsH-oZJ.js";import"./useElementFilter-C0647VAd.js";import"./EmptyState-BsowDiiM.js";import"./Progress-rlY7Qd6Q.js";import"./LinearProgress-DgysqIr2.js";import"./ResponseErrorPanel-DyBCHto1.js";import"./ErrorPanel-B9MZJL52.js";import"./WarningPanel-D_gQNl9J.js";import"./MarkdownContent-CCSCaS3C.js";import"./CodeSnippet-BNIZNbBb.js";import"./CopyTextButton-CxyLRgr5.js";import"./useCopyToClipboard-CrLUyXrt.js";import"./Tooltip-DlFbz0wm.js";import"./Popper-D7At4psl.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
