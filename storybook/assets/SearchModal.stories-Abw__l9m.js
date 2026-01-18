import{j as t,m as u,I as p,b as g,T as h}from"./iframe-Yl0Qc67S.js";import{r as x}from"./plugin-TzNuCugm.js";import{S as l,u as c,a as S}from"./useSearchModal-BHZNqfC7.js";import{B as m}from"./Button-bP0crEE2.js";import{a as M,b as C,c as f}from"./DialogTitle-DbBdv3gV.js";import{B as j}from"./Box-DltD7D0m.js";import{S as n}from"./Grid-BoLsaJTc.js";import{S as y}from"./SearchType-CTH_xjdi.js";import{L as I}from"./List-C5jB0ILm.js";import{H as B}from"./DefaultResultListItem-uvDLVHOp.js";import{s as D,M as G}from"./api-TiC-QtXP.js";import{S as R}from"./SearchContext-CR4PpZdK.js";import{w as T}from"./appWrappers-CnXqdPEu.js";import{SearchBar as k}from"./SearchBar-c0zRuKZ8.js";import{a as v}from"./SearchResult-C9aE-Fd2.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B7-flUez.js";import"./Plugin-Beh3pv9A.js";import"./componentData-D8eoWRR-.js";import"./useAnalytics-De1GIX-U.js";import"./useApp-5HecZ9VC.js";import"./useRouteRef-DxCJ4QuA.js";import"./index-CuRibKaG.js";import"./ArrowForward-BkzBO0po.js";import"./translation-qBwLeTu5.js";import"./Page-BnwCne9q.js";import"./useMediaQuery-Cyh9vow2.js";import"./Divider-DRYu6qgR.js";import"./ArrowBackIos-DLXvJV--.js";import"./ArrowForwardIos-C-GAOEgh.js";import"./translation-CfmM_YMb.js";import"./Modal-iRV6ko-2.js";import"./Portal-kuGKvNyC.js";import"./Backdrop-DutGXUrc.js";import"./styled-DXbACUbA.js";import"./ExpandMore-DlTYCfZc.js";import"./useAsync-HjbYn2WS.js";import"./useMountedState-B1Psi6MC.js";import"./AccordionDetails-UWNICwr0.js";import"./index-B9sM2jn7.js";import"./Collapse-CReMq_1Z.js";import"./ListItem-BafF8VBM.js";import"./ListContext-BQmyr3YY.js";import"./ListItemIcon-BBoQp_EU.js";import"./ListItemText-9ikpSF0R.js";import"./Tabs-6I-FvnRq.js";import"./KeyboardArrowRight-BTn6OxGK.js";import"./FormLabel-X5s09W4h.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Cfjv2ZGh.js";import"./InputLabel-DXxr-HuM.js";import"./Select-DtrkxSxy.js";import"./Popover-CGGMzivv.js";import"./MenuItem-bXxOMkF9.js";import"./Checkbox-B6jOi594.js";import"./SwitchBase-C1s3DxnG.js";import"./Chip-DeGLrGMy.js";import"./Link-_9kMa81h.js";import"./lodash-DLuUt6m8.js";import"./useObservable-DO3JHHHA.js";import"./useIsomorphicLayoutEffect-BgwaU1Zu.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-Cus5olUw.js";import"./useDebounce-m2Dd7DGA.js";import"./InputAdornment-Brz9bA89.js";import"./TextField-C8XSSXD9.js";import"./useElementFilter-Besy0Owa.js";import"./EmptyState-D7z5r--V.js";import"./Progress-DOTxQNtl.js";import"./LinearProgress-6nq8QBqK.js";import"./ResponseErrorPanel-BJLWLyiz.js";import"./ErrorPanel-DLd7jlxf.js";import"./WarningPanel-DPnP4zkP.js";import"./MarkdownContent-DmHmkZd9.js";import"./CodeSnippet-B108T10t.js";import"./CopyTextButton-3gQ_70GM.js";import"./useCopyToClipboard-BnQ5eYWr.js";import"./Tooltip-N5ZLqhtT.js";import"./Popper-90U13irg.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
