import{j as t,W as u,K as p,X as g}from"./iframe-DxoM00WU.js";import{r as h}from"./plugin-BvgZaisL.js";import{S as l,u as c,a as x}from"./useSearchModal-Dk2ve3UM.js";import{s as S,M}from"./api-BSzHX6fK.js";import{S as C}from"./SearchContext-BkiSy7aj.js";import{B as m}from"./Button-BTn5C8rA.js";import{m as f}from"./makeStyles-DpSWpYQd.js";import{D as j,a as y,b as B}from"./DialogTitle-oVgXPuIp.js";import{B as D}from"./Box-BuH3verr.js";import{S as n}from"./Grid-CMfdjtyd.js";import{S as I}from"./SearchType-AG0h8xi0.js";import{L as G}from"./List-BeR0746K.js";import{H as R}from"./DefaultResultListItem-BihA1t2R.js";import{w as k}from"./appWrappers-ByRWqwFU.js";import{SearchBar as v}from"./SearchBar-RkrmrbTH.js";import{S as T}from"./SearchResult-B3BfkglJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C0VoJaHP.js";import"./Plugin-CN1Wojjw.js";import"./componentData-DnoXAnRR.js";import"./useAnalytics-mBqSlN4Y.js";import"./useApp-Bd-HTri1.js";import"./useRouteRef-B3hJecQ0.js";import"./index-qkppG4LT.js";import"./ArrowForward-a3KG2ord.js";import"./translation-Bboy7Lfn.js";import"./Page-D2sChA35.js";import"./useMediaQuery-BvqV6vqV.js";import"./Divider-frXs4-4y.js";import"./ArrowBackIos-FVNctgS0.js";import"./ArrowForwardIos-DuPzK1LH.js";import"./translation-CCC1akf8.js";import"./lodash-ciR6S4x9.js";import"./useAsync-CeaRa2fE.js";import"./useMountedState-DpxGQQbT.js";import"./Modal-IEXX_SfX.js";import"./Portal-DXumaV8r.js";import"./Backdrop-DekBeEL3.js";import"./styled-4EHbyUJg.js";import"./ExpandMore-CGZzUraL.js";import"./AccordionDetails-6dcnPqQb.js";import"./index-B9sM2jn7.js";import"./Collapse-D-BKwRaA.js";import"./ListItem-wzN9QCAC.js";import"./ListContext-CgvnrPIp.js";import"./ListItemIcon-FtTNVxYM.js";import"./ListItemText-D-C3Y3D8.js";import"./Tabs-Bq8i_wc4.js";import"./KeyboardArrowRight-3T_z1hPT.js";import"./FormLabel-D8-aPs5O.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Dc1NZJIO.js";import"./InputLabel-Buk83yh8.js";import"./Select-BnpWZ4Er.js";import"./Popover-CFGP6ygZ.js";import"./MenuItem-DyNpsNcu.js";import"./Checkbox-DipdhAwp.js";import"./SwitchBase-CO_NQe2c.js";import"./Chip-DzRuh1Y6.js";import"./Link-CCbxACe0.js";import"./index-ClsZGDFK.js";import"./useObservable-CK6-xm53.js";import"./useIsomorphicLayoutEffect-CKd88-gw.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CcjTa-kq.js";import"./useDebounce-BWfX3xdc.js";import"./InputAdornment-BsFXpHtV.js";import"./TextField-CNRkNFqQ.js";import"./useElementFilter-DScDInag.js";import"./EmptyState-DScqg5oR.js";import"./Progress-CGeh14hb.js";import"./LinearProgress-3_Ej8fQE.js";import"./ResponseErrorPanel-DSZuGYwL.js";import"./ErrorPanel-DkYrO0IX.js";import"./WarningPanel-CVTYfZJZ.js";import"./MarkdownContent-CiLDLTud.js";import"./CodeSnippet-yWpS3zh4.js";import"./CopyTextButton-5eKqVxvn.js";import"./useCopyToClipboard-CfqnmD1o.js";import"./Tooltip-BzQR3gsg.js";import"./Popper-Ceh68zhn.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
