import{j as t,m as u,I as p,b as g,T as h}from"./iframe-CMoZkI_V.js";import{r as x}from"./plugin-CrYADn4T.js";import{S as l,u as c,a as S}from"./useSearchModal-BdCs6p5f.js";import{B as m}from"./Button-CMlJ_q4q.js";import{a as M,b as C,c as f}from"./DialogTitle-D9NQ_O8G.js";import{B as j}from"./Box-DDWlRNcc.js";import{S as n}from"./Grid-Cc5u-Kft.js";import{S as y}from"./SearchType-C3v-N0Sy.js";import{L as I}from"./List-mLBkoS87.js";import{H as B}from"./DefaultResultListItem--u3O9smb.js";import{s as D,M as G}from"./api-BfofgL2m.js";import{S as R}from"./SearchContext-D7PPC6FZ.js";import{w as T}from"./appWrappers-CwLdvgVt.js";import{SearchBar as k}from"./SearchBar-B2zR3YJP.js";import{a as v}from"./SearchResult-CpX9Rn1e.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DEPSeTYd.js";import"./Plugin-Cw-agZnT.js";import"./componentData-C1GpKGWH.js";import"./useAnalytics-aVKC-y-x.js";import"./useApp-Cq0FwDqI.js";import"./useRouteRef-BKopQGJE.js";import"./index-Dl6v8jff.js";import"./ArrowForward-CYQeWInn.js";import"./translation-DdbcM-Us.js";import"./Page-B6y8loe4.js";import"./useMediaQuery-B79j4-5g.js";import"./Divider-DAPmlDv6.js";import"./ArrowBackIos-GtZ4OB_8.js";import"./ArrowForwardIos-C6RksURZ.js";import"./translation-ChqOoxIc.js";import"./Modal-JpNI_f-q.js";import"./Portal-BsEe4NVr.js";import"./Backdrop-t6uNU6s-.js";import"./styled-BPnpuM9w.js";import"./ExpandMore-RbVyUBOe.js";import"./useAsync-nuZztPgy.js";import"./useMountedState-DXAXWcHb.js";import"./AccordionDetails-BpZtQ7qf.js";import"./index-B9sM2jn7.js";import"./Collapse-CttgXTbY.js";import"./ListItem-DQ5raIpn.js";import"./ListContext-DCW7FG4X.js";import"./ListItemIcon-BOmBm_9e.js";import"./ListItemText-CMPMNvTt.js";import"./Tabs-7iYiEnlu.js";import"./KeyboardArrowRight-C5mIemd-.js";import"./FormLabel-puaj9Kks.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CYLNnuhF.js";import"./InputLabel-h0iWwr6w.js";import"./Select-Du7ISKFa.js";import"./Popover-uKAOvxlN.js";import"./MenuItem-D3VGx5Fo.js";import"./Checkbox-BOa8MHJS.js";import"./SwitchBase-CEsz--IP.js";import"./Chip-BOkuIEwX.js";import"./Link-_YMea8vG.js";import"./lodash-DLuUt6m8.js";import"./useObservable-f8TZQGuk.js";import"./useIsomorphicLayoutEffect-DTydLypZ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BtO6Gze0.js";import"./useDebounce-CiGUy-gO.js";import"./InputAdornment-BEnE_DHi.js";import"./TextField-CzAvqVqZ.js";import"./useElementFilter-CaevaYu7.js";import"./EmptyState-CeEe5f96.js";import"./Progress-DioH0JJa.js";import"./LinearProgress-DQ7NJi3Y.js";import"./ResponseErrorPanel-DpLlRpA4.js";import"./ErrorPanel-4fnCiNRY.js";import"./WarningPanel-CrW_vej9.js";import"./MarkdownContent-BAnHPybQ.js";import"./CodeSnippet-CC5elSQb.js";import"./CopyTextButton-D_szYgc0.js";import"./useCopyToClipboard-LW0UmRxQ.js";import"./Tooltip-DqsRLJKa.js";import"./Popper-p2DZK6W8.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
