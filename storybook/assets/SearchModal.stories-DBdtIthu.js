import{j as t,W as u,K as p,X as g}from"./iframe-BWaAozhM.js";import{r as h}from"./plugin-Bpqo7Koh.js";import{S as l,u as c,a as x}from"./useSearchModal-BvPLxkZC.js";import{s as S,M}from"./api-BbfIOoSU.js";import{S as C}from"./SearchContext-BqA84v2x.js";import{B as m}from"./Button-BtXH8PBD.js";import{m as f}from"./makeStyles-BXQqwRxM.js";import{D as j,a as y,b as B}from"./DialogTitle-A7wXw_fs.js";import{B as D}from"./Box-B9d7t8SV.js";import{S as n}from"./Grid-Bpm_oOGo.js";import{S as I}from"./SearchType-DVmQc0ha.js";import{L as G}from"./List-d_1gDOpt.js";import{H as R}from"./DefaultResultListItem-DHse3YLZ.js";import{w as k}from"./appWrappers-C6IDOOCs.js";import{SearchBar as v}from"./SearchBar-1YFx84tZ.js";import{S as T}from"./SearchResult-DHURwKLs.js";import"./preload-helper-PPVm8Dsz.js";import"./index-iyrES_vD.js";import"./Plugin-ZVIKJlIN.js";import"./componentData-Bd9qinFb.js";import"./useAnalytics-CGFkzRxT.js";import"./useApp-oTx36hQg.js";import"./useRouteRef-cYGW2BLh.js";import"./index-Dm-FVvkq.js";import"./ArrowForward-CXL_C7Fe.js";import"./translation-r5aS_655.js";import"./Page-DnN8b5qI.js";import"./useMediaQuery-DxWsq45C.js";import"./Divider-DKWgzE0b.js";import"./ArrowBackIos-ulZYjRPn.js";import"./ArrowForwardIos-Du_KcaG-.js";import"./translation-CEq7l-bf.js";import"./lodash-C-lPDFyh.js";import"./useAsync-Cwpml34y.js";import"./useMountedState-BlQS3tzi.js";import"./Modal-DSMNGChR.js";import"./Portal-CeZ7D8j3.js";import"./Backdrop-BdEsQbzQ.js";import"./styled-BFyqjI4T.js";import"./ExpandMore-B6NFdm12.js";import"./AccordionDetails-BO1bPuht.js";import"./index-B9sM2jn7.js";import"./Collapse-PQIWvWXL.js";import"./ListItem-CwaI1EQV.js";import"./ListContext-KZtCLGQU.js";import"./ListItemIcon-Dmk9Y__O.js";import"./ListItemText-j6Wkxdaj.js";import"./Tabs-Dq07xJV_.js";import"./KeyboardArrowRight-CBjkn45j.js";import"./FormLabel-CHl2HXHP.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DNJmyzsM.js";import"./InputLabel-BxGo0aOj.js";import"./Select-q370X4Hr.js";import"./Popover-GnSZHMUP.js";import"./MenuItem-CWY30vWU.js";import"./Checkbox-opBu3oCg.js";import"./SwitchBase-CwOu7BV2.js";import"./Chip-vzBxutYj.js";import"./Link-CLkGqC_d.js";import"./index-8XpF7eZo.js";import"./useObservable-ZBbx2FoE.js";import"./useIsomorphicLayoutEffect-B9CHm_6H.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CfQKLbUr.js";import"./useDebounce-D1k2pYOm.js";import"./InputAdornment-BIR6tUbD.js";import"./TextField-CZRieWqm.js";import"./useElementFilter-CcN8jjzS.js";import"./EmptyState-Bb6P8kLl.js";import"./Progress-D9KK8zE7.js";import"./LinearProgress-bDj63ImO.js";import"./ResponseErrorPanel-gfymGEF_.js";import"./ErrorPanel-CpHKIhoR.js";import"./WarningPanel-Cz_PDSWX.js";import"./MarkdownContent-DDVgukGo.js";import"./CodeSnippet-CucDpp19.js";import"./CopyTextButton-C2yAL59V.js";import"./useCopyToClipboard-U7bSfaHE.js";import"./Tooltip-f0Mm140e.js";import"./Popper-Bx9nzt2H.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
