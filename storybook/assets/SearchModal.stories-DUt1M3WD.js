import{j as t,m as u,I as p,b as g,T as h}from"./iframe-DFN6SAj3.js";import{r as x}from"./plugin-CFwByUqw.js";import{S as l,u as c,a as S}from"./useSearchModal-hxpi02UI.js";import{B as m}from"./Button-DZ6ggl2r.js";import{a as M,b as C,c as f}from"./DialogTitle-CELxYlfT.js";import{B as j}from"./Box-CrX2Agh3.js";import{S as n}from"./Grid-CnDsPTZJ.js";import{S as y}from"./SearchType-BXygkqKh.js";import{L as I}from"./List-CNrJvNp3.js";import{H as B}from"./DefaultResultListItem-DuP11lH7.js";import{s as D,M as G}from"./api-Ccnl8lSb.js";import{S as R}from"./SearchContext-B99koYt0.js";import{w as T}from"./appWrappers-Ctv9hZvN.js";import{SearchBar as k}from"./SearchBar-BxWgHSsr.js";import{a as v}from"./SearchResult-BuDK8Kmh.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D-tkUhhN.js";import"./Plugin-D6woGNMR.js";import"./componentData-BPXI-FVd.js";import"./useAnalytics-B9OoIKEa.js";import"./useApp-B_iVMZKS.js";import"./useRouteRef-CsRrhzNw.js";import"./index-BUG12Py2.js";import"./ArrowForward-DrIDPrkh.js";import"./translation-DGEaEDAv.js";import"./Page-CWBGk8Er.js";import"./useMediaQuery-DSgtlo1T.js";import"./Divider-C4fHH6xB.js";import"./ArrowBackIos-EnPS66o3.js";import"./ArrowForwardIos-D37j7vNE.js";import"./translation-CcbbH9Nu.js";import"./Modal-B95o4eGb.js";import"./Portal-6-SOUMqq.js";import"./Backdrop-CFExy8rC.js";import"./styled-UJWvm5Ja.js";import"./ExpandMore-Baqg86ni.js";import"./useAsync-Aw_hIc9t.js";import"./useMountedState-0rCkRX95.js";import"./AccordionDetails-BCiojWwT.js";import"./index-B9sM2jn7.js";import"./Collapse-Dmxu6_xf.js";import"./ListItem-khPUul4I.js";import"./ListContext-B6gycCKe.js";import"./ListItemIcon-PITMPsoz.js";import"./ListItemText-CEkrmQrS.js";import"./Tabs-Dbghctby.js";import"./KeyboardArrowRight-CuxrVWL_.js";import"./FormLabel-DUrVp3SF.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BxfLn8nf.js";import"./InputLabel-Dno2lWaD.js";import"./Select-CMyphI3f.js";import"./Popover-Bzc6rxtE.js";import"./MenuItem-DRFraA0M.js";import"./Checkbox-RvD1CCRM.js";import"./SwitchBase-BK_UrKt7.js";import"./Chip-SCOFFVp3.js";import"./Link-DZVnE3x4.js";import"./lodash-DLuUt6m8.js";import"./useObservable-HXm7xrFW.js";import"./useIsomorphicLayoutEffect-DE10RVz8.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DsDYrqfe.js";import"./useDebounce-BVzXxf6D.js";import"./InputAdornment-Cu1Kw_Y1.js";import"./TextField-CYQACmnC.js";import"./useElementFilter-DRHlrKpe.js";import"./EmptyState-MB0YJqWo.js";import"./Progress-BCHxs1Iv.js";import"./LinearProgress-zvmV_ESn.js";import"./ResponseErrorPanel-DfQj7UUR.js";import"./ErrorPanel-DGkagluo.js";import"./WarningPanel-CcjMMskt.js";import"./MarkdownContent-C7YoEea1.js";import"./CodeSnippet-DP1ZDnW-.js";import"./CopyTextButton-bz5fwOjo.js";import"./useCopyToClipboard-S8C7f3cV.js";import"./Tooltip-B6ATafnk.js";import"./Popper-BPOHrmiw.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
