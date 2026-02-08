import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-Cih9KYts.js";import{r as x}from"./plugin-AlTbBZ5j.js";import{S as l,u as c,a as S}from"./useSearchModal-BGYNvbZq.js";import{s as M,M as C}from"./api-C9Cc-uCq.js";import{S as f}from"./SearchContext-DIcRkiWA.js";import{B as m}from"./Button-CKd96K2t.js";import{D as j,a as y,b as B}from"./DialogTitle-CuYpVqTb.js";import{B as D}from"./Box-5LOyitj9.js";import{S as n}from"./Grid-CLRvRbDN.js";import{S as I}from"./SearchType-BP4W8vJE.js";import{L as G}from"./List-DfB6hke5.js";import{H as R}from"./DefaultResultListItem-C2wXDcb4.js";import{w as k}from"./appWrappers-C7AQtpTy.js";import{SearchBar as v}from"./SearchBar-q-1P9Q8u.js";import{S as T}from"./SearchResult-DaOWyiI-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CmBl_uuR.js";import"./Plugin-C_qaKzy-.js";import"./componentData-DlgYE3l_.js";import"./useAnalytics-Cmhz127l.js";import"./useApp-sV2xt9cM.js";import"./useRouteRef-DDi4DkR7.js";import"./index-Bp0jFuCJ.js";import"./ArrowForward-Br-ribbp.js";import"./translation-wAq3Fqx1.js";import"./Page-CbgYX9Wj.js";import"./useMediaQuery-DCClq_xQ.js";import"./Divider-BNkMSFIU.js";import"./ArrowBackIos-BrrPBkiG.js";import"./ArrowForwardIos-B0erA84l.js";import"./translation-BGdEcgPq.js";import"./lodash-Czox7iJy.js";import"./useAsync-DPHt3xdh.js";import"./useMountedState-BYMagqon.js";import"./Modal-BZoQWh9B.js";import"./Portal-DG1SCA6E.js";import"./Backdrop-DyvTB40d.js";import"./styled-VBtFtbNj.js";import"./ExpandMore-Dc1qa72P.js";import"./AccordionDetails-CzBbo4eK.js";import"./index-B9sM2jn7.js";import"./Collapse-B12c-Txj.js";import"./ListItem-D5wUjexN.js";import"./ListContext-DH23_8Wk.js";import"./ListItemIcon-DcBwmHXU.js";import"./ListItemText-jFKdxWsL.js";import"./Tabs-DVF-10l7.js";import"./KeyboardArrowRight-D72hQi42.js";import"./FormLabel-COht3U-T.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-4MorzmI2.js";import"./InputLabel-Bs3e7Pvi.js";import"./Select-zsC6tXpT.js";import"./Popover-Dg3slux6.js";import"./MenuItem-CM6q5OW6.js";import"./Checkbox-sHHhxHXb.js";import"./SwitchBase-Df9wCHit.js";import"./Chip-CY64tnBt.js";import"./Link-Ds2c62Jm.js";import"./useObservable-BtgVS7-k.js";import"./useIsomorphicLayoutEffect-dPDL8wRM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CTK3U7Sv.js";import"./useDebounce-DqiQBHM6.js";import"./InputAdornment-CpD9WJQR.js";import"./TextField-xUwXrmKL.js";import"./useElementFilter-DJYAdyiW.js";import"./EmptyState-B5PFzl9I.js";import"./Progress-YuIdkVov.js";import"./LinearProgress-B40cTZ8l.js";import"./ResponseErrorPanel-x_jZOAD9.js";import"./ErrorPanel-DT8LzRfG.js";import"./WarningPanel-Cevqk5r0.js";import"./MarkdownContent-DcL7o88V.js";import"./CodeSnippet-vQgCgAWU.js";import"./CopyTextButton-CcbF4huw.js";import"./useCopyToClipboard-7I7t0jup.js";import"./Tooltip-CgFVFwTk.js";import"./Popper-D0FUS77U.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
