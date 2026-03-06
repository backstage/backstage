import{j as t,W as u,K as p,X as g}from"./iframe-DsSIhbnH.js";import{r as h}from"./plugin-BFxBMDfM.js";import{S as l,u as c,a as x}from"./useSearchModal-CcR4Lkk4.js";import{s as S,M}from"./api-CymgrvAp.js";import{S as C}from"./SearchContext-CwiYvo6a.js";import{B as m}from"./Button-Bd8OjFri.js";import{m as f}from"./makeStyles-BTdK2mva.js";import{D as j,a as y,b as B}from"./DialogTitle-Cf0w-kda.js";import{B as D}from"./Box-CLIZZYjM.js";import{S as n}from"./Grid-DCNbb8Yd.js";import{S as I}from"./SearchType-CjohwheQ.js";import{L as G}from"./List-CxhAFISx.js";import{H as R}from"./DefaultResultListItem-9jq96ubZ.js";import{w as k}from"./appWrappers-YNWN04ek.js";import{SearchBar as v}from"./SearchBar-BeE-nDvA.js";import{S as T}from"./SearchResult-BXq0uomA.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DRZTXr6L.js";import"./Plugin-CZGYbG_3.js";import"./componentData-DtY2_pZ9.js";import"./useAnalytics-DEZMyLWf.js";import"./useApp-ByARTA3Z.js";import"./useRouteRef-0S-UT0UD.js";import"./index-DGCaJysn.js";import"./ArrowForward-Dw1AsfMN.js";import"./translation-DQYsn73d.js";import"./Page-DWwVgphw.js";import"./useMediaQuery-CUAoQyxB.js";import"./Divider-D86QvihC.js";import"./ArrowBackIos-C-Cx1VU7.js";import"./ArrowForwardIos-DjEkwanG.js";import"./translation-DCgv1bM7.js";import"./lodash-Cg6PKVQd.js";import"./useAsync-aBdJ7Q8-.js";import"./useMountedState-C6iJ77g7.js";import"./Modal-jFWOd40w.js";import"./Portal-BImzt5t3.js";import"./Backdrop-SO7N7P7F.js";import"./styled-B9BbiYac.js";import"./ExpandMore-cDvbVPBi.js";import"./AccordionDetails-snfMz8Qp.js";import"./index-B9sM2jn7.js";import"./Collapse-CHKKtFrf.js";import"./ListItem-CaDFxyiK.js";import"./ListContext-B0w45w1v.js";import"./ListItemIcon-k5bTZXsG.js";import"./ListItemText-BTHgyaEj.js";import"./Tabs-DL2wdisD.js";import"./KeyboardArrowRight-0Dq_rrCU.js";import"./FormLabel-BeUo2ALU.js";import"./formControlState-DiVLcwSD.js";import"./InputLabel-BV_HhXw-.js";import"./Select-CX7BN7Qw.js";import"./Popover-C10icIW0.js";import"./MenuItem-C4TeZNy8.js";import"./Checkbox-BJKN6I7I.js";import"./SwitchBase-Dwl6zHjj.js";import"./Chip-CarYMdKj.js";import"./Link-eFTMg8Ng.js";import"./index-C37t8kC7.js";import"./useObservable-Caqpr-Ay.js";import"./useIsomorphicLayoutEffect-C4ssAhsG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BSTPTSBK.js";import"./useDebounce-Dw2XWAZL.js";import"./InputAdornment-DocIvHr3.js";import"./TextField-CUR4pckB.js";import"./useElementFilter-Cgwnx25Z.js";import"./EmptyState-Det5UrHd.js";import"./Progress-DKVw297-.js";import"./LinearProgress-COAa26G8.js";import"./ResponseErrorPanel-Bie8pNSQ.js";import"./ErrorPanel-CZEIKFQ8.js";import"./WarningPanel-BMSmUhUZ.js";import"./MarkdownContent-Dr9_9m3_.js";import"./CodeSnippet-Dv95AdAh.js";import"./CopyTextButton-CfEMnb5X.js";import"./useCopyToClipboard-DVNa0Xen.js";import"./Tooltip-Cs7i-ltk.js";import"./Popper-BoqtvTN5.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
