import{j as t,m as u,I as p,b as g,T as h}from"./iframe-BY6cr4Gs.js";import{r as x}from"./plugin-DfBn9OsQ.js";import{S as l,u as c,a as S}from"./useSearchModal-Cf_pS_kw.js";import{B as m}from"./Button-BcV-aad6.js";import{a as M,b as C,c as f}from"./DialogTitle-CbbvyQ_k.js";import{B as j}from"./Box-CioLgZLe.js";import{S as n}from"./Grid-CPNST6ei.js";import{S as y}from"./SearchType-VkAL99k7.js";import{L as I}from"./List-BYnFuPKk.js";import{H as B}from"./DefaultResultListItem-B2KJzBiq.js";import{s as D,M as G}from"./api-Bn_bwlkS.js";import{S as R}from"./SearchContext-Dt9zyNyK.js";import{w as T}from"./appWrappers-Pq-5KpLz.js";import{SearchBar as k}from"./SearchBar-BNF9rHlH.js";import{a as v}from"./SearchResult-Mc_0-00L.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B19kwgjz.js";import"./Plugin-1eY0U0Da.js";import"./componentData-DkH1zoGD.js";import"./useAnalytics-BgncGw0N.js";import"./useApp-Tcb-kbrm.js";import"./useRouteRef-CBJLvC2e.js";import"./index-CidjncPb.js";import"./ArrowForward-C-vHhjk_.js";import"./translation-CH_8bc97.js";import"./Page-D56aaN-R.js";import"./useMediaQuery-BQ9F9Qxa.js";import"./Divider-0kZVZRxa.js";import"./ArrowBackIos-BP6RMj3C.js";import"./ArrowForwardIos-CRLF9ds4.js";import"./translation-IDVW-xh6.js";import"./Modal-27M29ymL.js";import"./Portal-RovY2swJ.js";import"./Backdrop-BfxA9Fnq.js";import"./styled-C2PdKBXZ.js";import"./ExpandMore-3nEtbL-z.js";import"./useAsync-BOpzAa1K.js";import"./useMountedState-wBq7rhLl.js";import"./AccordionDetails-B6u38Rkn.js";import"./index-B9sM2jn7.js";import"./Collapse-hpYL9C9B.js";import"./ListItem-Bc4c47Te.js";import"./ListContext-Cv7Ut4-T.js";import"./ListItemIcon-D_2DVl9p.js";import"./ListItemText-DmFJDJ0x.js";import"./Tabs-CyJ-5ClU.js";import"./KeyboardArrowRight-WU2ofvRQ.js";import"./FormLabel-BzT2D_7Q.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CHRehZxK.js";import"./InputLabel-C4V1mFuX.js";import"./Select-Dk4pHiCq.js";import"./Popover-CSLjBTLK.js";import"./MenuItem-D_E8OHlC.js";import"./Checkbox-Op7BBwQy.js";import"./SwitchBase-DxbKBBck.js";import"./Chip-BO_EQzA0.js";import"./Link-Y-vtcYZ5.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-BMg2j1pk.js";import"./useIsomorphicLayoutEffect-BEJqApFw.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-C1C8jSb1.js";import"./useDebounce-CWCoFPVw.js";import"./InputAdornment-0KpUIsyl.js";import"./TextField-CzeKprQz.js";import"./useElementFilter-CN7RVtxc.js";import"./EmptyState-CSpDqmDJ.js";import"./Progress-DgqZSMMd.js";import"./LinearProgress-De55rnu5.js";import"./ResponseErrorPanel-jJbPaYnV.js";import"./ErrorPanel-DAslEoWf.js";import"./WarningPanel-CSeK1Ani.js";import"./MarkdownContent-pb-oNpPa.js";import"./CodeSnippet-CfugQICb.js";import"./CopyTextButton-CGe-CNwz.js";import"./useCopyToClipboard-Cl0_Rkec.js";import"./Tooltip-BeI5iaz3.js";import"./Popper-DBVT3TNi.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
