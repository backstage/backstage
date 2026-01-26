import{j as t,m as u,I as p,b as g,T as h}from"./iframe-BUNFJ-LL.js";import{r as x}from"./plugin-yKDzvPLF.js";import{S as l,u as c,a as S}from"./useSearchModal-IYMIo-Cq.js";import{B as m}from"./Button-D5VZkG9s.js";import{a as M,b as C,c as f}from"./DialogTitle-hXdjHSFc.js";import{B as j}from"./Box-E56LyC2U.js";import{S as n}from"./Grid-DBxLs0pG.js";import{S as y}from"./SearchType-B99ENhkY.js";import{L as I}from"./List-TXTv7s6H.js";import{H as B}from"./DefaultResultListItem-G9RbWBWA.js";import{s as D,M as G}from"./api-BMyYV67s.js";import{S as R}from"./SearchContext-0ogBco_9.js";import{w as T}from"./appWrappers-DwaX-D8B.js";import{SearchBar as k}from"./SearchBar-CBQj5_rA.js";import{a as v}from"./SearchResult-21fi1pH_.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BeHd8hJO.js";import"./Plugin-CX2F1Eyu.js";import"./componentData-zDZJvmdk.js";import"./useAnalytics-BrGJTKfU.js";import"./useApp-DBsIRrNl.js";import"./useRouteRef-DmkHHcok.js";import"./index-SSMRT9Bs.js";import"./ArrowForward-d_wnYzhM.js";import"./translation-VahZo0BD.js";import"./Page-DjRKu_HT.js";import"./useMediaQuery-DBcwnV0_.js";import"./Divider-CRo1EOKz.js";import"./ArrowBackIos-Cv7gmvPk.js";import"./ArrowForwardIos-CPuoyVDn.js";import"./translation-Bhf-jLTv.js";import"./Modal-Cwa9uuB3.js";import"./Portal-j32zjom2.js";import"./Backdrop-BXminUHH.js";import"./styled-BK7FZU9O.js";import"./ExpandMore-BvmDc48x.js";import"./useAsync-BJYhKhAw.js";import"./useMountedState-ykOrhzDb.js";import"./AccordionDetails-NEVFuKGX.js";import"./index-B9sM2jn7.js";import"./Collapse-oWd9G09k.js";import"./ListItem-DqtCuPtR.js";import"./ListContext-DDohaQJk.js";import"./ListItemIcon-BaVzYsIK.js";import"./ListItemText-Csz7vtMz.js";import"./Tabs-BpDARNWL.js";import"./KeyboardArrowRight-BY-m1j12.js";import"./FormLabel-C_IRPNph.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DqfIa0Dm.js";import"./InputLabel-CiiZN-sU.js";import"./Select-BkWY0oDV.js";import"./Popover-Dheh4pDu.js";import"./MenuItem-D5tZwe5H.js";import"./Checkbox-C0shAQFP.js";import"./SwitchBase-DfQIqOIj.js";import"./Chip-xFVbq4gh.js";import"./Link-9uhrDkOF.js";import"./lodash-Czox7iJy.js";import"./useObservable-DQm2eMWh.js";import"./useIsomorphicLayoutEffect-CfM2gomt.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-tZiVl_5B.js";import"./useDebounce-CXgf5AhG.js";import"./InputAdornment-Byn5G8Mz.js";import"./TextField-BJq2ASY5.js";import"./useElementFilter-ld2ah69M.js";import"./EmptyState-DvVUf6i4.js";import"./Progress-CW5gtCt2.js";import"./LinearProgress-CcYx_mjo.js";import"./ResponseErrorPanel-DUXPxA8r.js";import"./ErrorPanel-B1RREPgC.js";import"./WarningPanel-Ba3usJjp.js";import"./MarkdownContent-Baqdegrk.js";import"./CodeSnippet-BIdXEEly.js";import"./CopyTextButton-Do76HFgY.js";import"./useCopyToClipboard-TXjlrrXP.js";import"./Tooltip-Cy4UhZnY.js";import"./Popper-Bi7zPSXU.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
