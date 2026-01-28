import{j as t,m as u,I as p,b as g,T as h}from"./iframe-B9hgvJLw.js";import{r as x}from"./plugin-DeznsScq.js";import{S as l,u as c,a as S}from"./useSearchModal-FD155Emu.js";import{B as m}from"./Button-D3LDd96-.js";import{a as M,b as C,c as f}from"./DialogTitle-D9yo_Iy-.js";import{B as j}from"./Box-BsI7Fu14.js";import{S as n}from"./Grid-g3HyMBvJ.js";import{S as y}from"./SearchType-CKnYXevy.js";import{L as I}from"./List-BDdcqK40.js";import{H as B}from"./DefaultResultListItem-C_3ub1_W.js";import{s as D,M as G}from"./api-o595VOBj.js";import{S as R}from"./SearchContext-CI5oNyE_.js";import{w as T}from"./appWrappers-Du9InaF6.js";import{SearchBar as k}from"./SearchBar-DCpH0ZQG.js";import{a as v}from"./SearchResult-BVdJNSHS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-c7iPt_CF.js";import"./Plugin-D-bM_T9Q.js";import"./componentData-BIeygeYY.js";import"./useAnalytics-DMsrMH_e.js";import"./useApp-DISJeDPh.js";import"./useRouteRef-nNeqZu86.js";import"./index-CsGVCGL2.js";import"./ArrowForward-CIWVdsJM.js";import"./translation-DR0xsrE7.js";import"./Page-BdxQozw5.js";import"./useMediaQuery-YZUmHHf3.js";import"./Divider-CdNlJD_Q.js";import"./ArrowBackIos-qDXgEwCA.js";import"./ArrowForwardIos-xM0ld2BB.js";import"./translation-BweiYMkS.js";import"./Modal-Ca-S6eXi.js";import"./Portal-pCoOC46-.js";import"./Backdrop-BmcNn5D8.js";import"./styled-CF5nzrfv.js";import"./ExpandMore-BoLpzv6N.js";import"./useAsync-y2hE-c2R.js";import"./useMountedState-kHvlJXnr.js";import"./AccordionDetails-CKakyLf0.js";import"./index-B9sM2jn7.js";import"./Collapse-FgK-KUTI.js";import"./ListItem-Bp1BuLev.js";import"./ListContext-DgcYteU3.js";import"./ListItemIcon-BwAFXEbZ.js";import"./ListItemText-Bx_jgiBv.js";import"./Tabs-BDuYFNVG.js";import"./KeyboardArrowRight-DBZvYWI6.js";import"./FormLabel-Dm56BTx2.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C7CCQ6d6.js";import"./InputLabel-zUexdHPJ.js";import"./Select-DA_ifAoh.js";import"./Popover-Bfr2YV3y.js";import"./MenuItem-DgqahWY8.js";import"./Checkbox-BV1R31S7.js";import"./SwitchBase-BbzbqIty.js";import"./Chip-D7PRRD71.js";import"./Link-C9X-RXqH.js";import"./lodash-Czox7iJy.js";import"./useObservable-BcGRWwwK.js";import"./useIsomorphicLayoutEffect-DSwb9vld.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CeDKu8cY.js";import"./useDebounce-BkkthU-t.js";import"./InputAdornment-CiDgCo6f.js";import"./TextField-Bd7Hhesh.js";import"./useElementFilter-Qxi84Lc7.js";import"./EmptyState-pIekTMtO.js";import"./Progress-Qwcg9Eg2.js";import"./LinearProgress-CmNofmWj.js";import"./ResponseErrorPanel-fD74zqn3.js";import"./ErrorPanel-CtYawyCD.js";import"./WarningPanel-CWYhx9r2.js";import"./MarkdownContent-B8lxAtZu.js";import"./CodeSnippet-BVb_NoMX.js";import"./CopyTextButton-DAUaMyUM.js";import"./useCopyToClipboard-D14CO7yh.js";import"./Tooltip-RfNF6Jnk.js";import"./Popper-BAAWK9EZ.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
