import{j as t,W as u,K as p,X as g}from"./iframe-CSFr66Yj.js";import{r as h}from"./plugin-CCgK02J3.js";import{S as l,u as c,a as x}from"./useSearchModal-Dp-tmd9x.js";import{s as S,M}from"./api-Cx46QNhu.js";import{S as C}from"./SearchContext-BPLzmNVc.js";import{B as m}from"./Button-B1X7WcFY.js";import{m as f}from"./makeStyles-uVnrWAVB.js";import{D as j,a as y,b as B}from"./DialogTitle-3YluoCWB.js";import{B as D}from"./Box-Cb3Gr3iO.js";import{S as n}from"./Grid-ClhOBUNV.js";import{S as I}from"./SearchType-vHOPe4ln.js";import{L as G}from"./List-CTsa5Vil.js";import{H as R}from"./DefaultResultListItem-CdkckZHi.js";import{w as k}from"./appWrappers-Bw-oWAKY.js";import{SearchBar as v}from"./SearchBar-BiKrdDBI.js";import{S as T}from"./SearchResult-D0Aw0zGO.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CtMBmf0K.js";import"./Plugin-ezyLDHuW.js";import"./componentData-Dsen7ALy.js";import"./useAnalytics-iKBzR4vv.js";import"./useApp-9WiUV6Eb.js";import"./useRouteRef-B27Nf4F3.js";import"./index-CWVjNXJ7.js";import"./ArrowForward-CN7oQsco.js";import"./translation-BbaQq5Dc.js";import"./Page-W_eHw0n3.js";import"./useMediaQuery-DIGLFfUs.js";import"./Divider-CcxNX2dS.js";import"./ArrowBackIos-CDeooJKH.js";import"./ArrowForwardIos-vyRAWGF-.js";import"./translation-D3Gy-xwL.js";import"./lodash-DoZXRjYt.js";import"./useAsync-wOC6Ca_H.js";import"./useMountedState-BLBZO_0R.js";import"./Modal-5v8JZx8M.js";import"./Portal-B40i3148.js";import"./Backdrop-Ba2EdBhi.js";import"./styled-CmsioGDa.js";import"./ExpandMore-CYdmrhn0.js";import"./AccordionDetails-gWBQL4CY.js";import"./index-B9sM2jn7.js";import"./Collapse-CACY-YW1.js";import"./ListItem--clkBOsd.js";import"./ListContext-hUquPiBr.js";import"./ListItemIcon-B7LrswSv.js";import"./ListItemText-D6Yo_WD1.js";import"./Tabs-BzLxrD3r.js";import"./KeyboardArrowRight-FeM4Acay.js";import"./FormLabel-BN-v8TxK.js";import"./formControlState-Dzv_Uwgk.js";import"./InputLabel-CA5EtBPj.js";import"./Select-UXalYcvw.js";import"./Popover-BWrBUsLM.js";import"./MenuItem-C0jN9VnT.js";import"./Checkbox-uCHOcFNN.js";import"./SwitchBase-hb1ZVQ6x.js";import"./Chip-BS8w24E-.js";import"./Link-BuppC-Xy.js";import"./index-BbjHc-mo.js";import"./useObservable-D5AMUeGj.js";import"./useIsomorphicLayoutEffect-yyk4uM8f.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-Bo_giJDH.js";import"./useDebounce-DVnD6EpG.js";import"./InputAdornment-uPgCmhvq.js";import"./TextField-CeLPx3bo.js";import"./useElementFilter-hdMnzig-.js";import"./EmptyState-Cd_Nn6wZ.js";import"./Progress-qMJ2WkE0.js";import"./LinearProgress-DSfSnjbG.js";import"./ResponseErrorPanel-CxvWz03l.js";import"./ErrorPanel-BBFDgu-U.js";import"./WarningPanel-0pAFG3t5.js";import"./MarkdownContent-C-fsNcdE.js";import"./CodeSnippet-C27VEnjc.js";import"./CopyTextButton-DxxeYMWB.js";import"./useCopyToClipboard-BD8xRBtk.js";import"./Tooltip-DNXEZsSN.js";import"./Popper-P787cLfX.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{r as CustomModal,e as Default,lo as __namedExportsOrder,io as default};
