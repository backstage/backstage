import{j as t,m as u,I as p,b as g,T as h}from"./iframe-OUC1hy1H.js";import{r as x}from"./plugin-wNQH_TfH.js";import{S as l,u as c,a as S}from"./useSearchModal-C_l1aF9P.js";import{B as m}from"./Button-NJYqsc8m.js";import{a as M,b as C,c as f}from"./DialogTitle-CzK5jlaa.js";import{B as j}from"./Box-BmoTrTFH.js";import{S as n}from"./Grid-DL-Pv4jh.js";import{S as y}from"./SearchType-Bgn8ehIW.js";import{L as I}from"./List--3INAzqF.js";import{H as B}from"./DefaultResultListItem-Ce8jxtXt.js";import{s as D,M as G}from"./api-C0Hy5KZl.js";import{S as R}from"./SearchContext-e1r8ubOv.js";import{w as T}from"./appWrappers-DdOwToTM.js";import{SearchBar as k}from"./SearchBar-DSwuHRCG.js";import{a as v}from"./SearchResult-Dea6LLMc.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DBnHHQlp.js";import"./Plugin-DZn2Fxqk.js";import"./componentData-vJLnAM-9.js";import"./useAnalytics-XQGKPciY.js";import"./useApp-DyctZIWE.js";import"./useRouteRef-CAXRaq-D.js";import"./index-_R9_qqkB.js";import"./ArrowForward-CNrami9f.js";import"./translation-ClChyj5H.js";import"./Page-C46vA8aS.js";import"./useMediaQuery-iiV-a3fI.js";import"./Divider-CEY86Jg2.js";import"./ArrowBackIos-os6UxY8Z.js";import"./ArrowForwardIos-Do3348q0.js";import"./translation-Dp8Tkz4T.js";import"./Modal-B-jUxT4P.js";import"./Portal-DWQSZWuh.js";import"./Backdrop-D5NJdiNK.js";import"./styled-A6cHt6de.js";import"./ExpandMore-YNQPypsM.js";import"./useAsync-4gF4WzZl.js";import"./useMountedState-BrWxqueh.js";import"./AccordionDetails-BV-iIFxu.js";import"./index-B9sM2jn7.js";import"./Collapse-WWepLYBs.js";import"./ListItem-CyBq-NVx.js";import"./ListContext-DyoBs2U6.js";import"./ListItemIcon-CStyGwuG.js";import"./ListItemText-BN19jovg.js";import"./Tabs-CtrsHt1h.js";import"./KeyboardArrowRight--_MLuOVN.js";import"./FormLabel-BwHd8tn_.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B43knA35.js";import"./InputLabel-BX2nniBz.js";import"./Select-Bakifzxp.js";import"./Popover-BGS5mFaN.js";import"./MenuItem-B-FwqOHp.js";import"./Checkbox-BLPGDkpR.js";import"./SwitchBase-dXznQMKe.js";import"./Chip-DTsKk_Zu.js";import"./Link-CyOWt6Zg.js";import"./lodash-DLuUt6m8.js";import"./useObservable-BKXVW6Yy.js";import"./useIsomorphicLayoutEffect-BzuPE6E0.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BJ2fVkk1.js";import"./useDebounce-mVNrQtAG.js";import"./InputAdornment-CQopOXTl.js";import"./TextField-CHhPQ8if.js";import"./useElementFilter-C72_5G8k.js";import"./EmptyState-DmCt8Dtm.js";import"./Progress-ChJCSBkC.js";import"./LinearProgress-dYET9ZjM.js";import"./ResponseErrorPanel-Dkar7xbU.js";import"./ErrorPanel-D45LPvzG.js";import"./WarningPanel-4XJbGV6W.js";import"./MarkdownContent-DHn9pYVo.js";import"./CodeSnippet-DchPM48d.js";import"./CopyTextButton-DRNDJ6Lk.js";import"./useCopyToClipboard-B_WaDLJZ.js";import"./Tooltip-BQGIC7Cn.js";import"./Popper-vVGWEO2q.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
