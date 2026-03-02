import{j as t,W as u,K as p,X as g}from"./iframe-CGY8RtMM.js";import{r as h}from"./plugin-TX4UOybE.js";import{S as l,u as c,a as x}from"./useSearchModal-BEkc7GYD.js";import{s as S,M}from"./api-D-Yqlpwx.js";import{S as C}from"./SearchContext-opqB0z-1.js";import{B as m}from"./Button-BONd08TE.js";import{m as f}from"./makeStyles-DsrsBIHr.js";import{D as j,a as y,b as B}from"./DialogTitle-DDXEQqtB.js";import{B as D}from"./Box-CzermUI4.js";import{S as n}from"./Grid-C7KzSS4F.js";import{S as I}from"./SearchType-_wADSDnN.js";import{L as G}from"./List-BP8Bshto.js";import{H as R}from"./DefaultResultListItem-DKhai0bP.js";import{w as k}from"./appWrappers-sW7oOzTF.js";import{SearchBar as v}from"./SearchBar-Bn31xD4q.js";import{S as T}from"./SearchResult-DeTdmFL_.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DHpTSTld.js";import"./Plugin-BlVKuxBE.js";import"./componentData-CbkEAUB1.js";import"./useAnalytics-DzkBVlTS.js";import"./useApp-D6E87KeO.js";import"./useRouteRef-DIzgYUTd.js";import"./index-Brj28hLr.js";import"./ArrowForward-C2hlAd1z.js";import"./translation-DCPnmFH2.js";import"./Page-DOPpg5oB.js";import"./useMediaQuery-BrRGrmzS.js";import"./Divider-Br8PYMzl.js";import"./ArrowBackIos-D_Z9fln7.js";import"./ArrowForwardIos-DUdjqBLQ.js";import"./translation-Du7ORHps.js";import"./lodash-D5DB6SGB.js";import"./useAsync-DeQC24J1.js";import"./useMountedState-CiwiE7kc.js";import"./Modal-CjAaGIlL.js";import"./Portal-CPD4eQSx.js";import"./Backdrop-D0FBYj1Y.js";import"./styled-CKkmDcn6.js";import"./ExpandMore-Dmv7QB28.js";import"./AccordionDetails-U1rx4U3Z.js";import"./index-B9sM2jn7.js";import"./Collapse-D-fg3clD.js";import"./ListItem-mZsObVR0.js";import"./ListContext-CqJ372Q7.js";import"./ListItemIcon-D6gkUr9t.js";import"./ListItemText-CUaBPH5v.js";import"./Tabs-DcH1tcMC.js";import"./KeyboardArrowRight-DbxfU3j3.js";import"./FormLabel-CR5fGpjj.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DwH8W-_C.js";import"./InputLabel-DzeVmmuY.js";import"./Select-l4R_loA8.js";import"./Popover-DEBV3NVZ.js";import"./MenuItem-BBtigwgA.js";import"./Checkbox-DL7lPxja.js";import"./SwitchBase-CCgnxhYz.js";import"./Chip-BIoQ1eMT.js";import"./Link-DezUlcmn.js";import"./index-BLVERU9s.js";import"./useObservable-atFmgv2g.js";import"./useIsomorphicLayoutEffect-B8lTvGs7.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BDSeLxWC.js";import"./useDebounce-CMOUviX2.js";import"./InputAdornment-DEHwyDBL.js";import"./TextField-CT32zgPO.js";import"./useElementFilter-MsyEXqAA.js";import"./EmptyState-CpVNJHMA.js";import"./Progress-Z8H8_CCi.js";import"./LinearProgress-DrZz6jwB.js";import"./ResponseErrorPanel-DPZGLLoJ.js";import"./ErrorPanel-CVEMhsGR.js";import"./WarningPanel-D3szz0XR.js";import"./MarkdownContent-DYpR2nSA.js";import"./CodeSnippet-BhmLEwNc.js";import"./CopyTextButton-BZIaefKs.js";import"./useCopyToClipboard-CAkNDTn8.js";import"./Tooltip-CKxlzXa0.js";import"./Popper-DldGGRD9.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
