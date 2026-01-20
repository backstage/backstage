import{j as t,m as u,I as p,b as g,T as h}from"./iframe-Du4yWFmh.js";import{r as x}from"./plugin-pLXPov9e.js";import{S as l,u as c,a as S}from"./useSearchModal-BP8NwqLL.js";import{B as m}from"./Button-C5V9YZrj.js";import{a as M,b as C,c as f}from"./DialogTitle-Cps86Mxp.js";import{B as j}from"./Box-CkOOyHi_.js";import{S as n}from"./Grid-BAWrmmwT.js";import{S as y}from"./SearchType-v1qJg8dD.js";import{L as I}from"./List-C8YUr1Px.js";import{H as B}from"./DefaultResultListItem-BdhlIMNz.js";import{s as D,M as G}from"./api-OaMYHxrW.js";import{S as R}from"./SearchContext-BV-B-Pch.js";import{w as T}from"./appWrappers-C6fp3G6q.js";import{SearchBar as k}from"./SearchBar-CjZ2PGnK.js";import{a as v}from"./SearchResult-37e9Gud0.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bskox0XY.js";import"./Plugin-tqD9UBew.js";import"./componentData-Cum-Z3JG.js";import"./useAnalytics-mdAgoHs9.js";import"./useApp-DvME4Mfb.js";import"./useRouteRef-C6zbOJHI.js";import"./index-Br3zvZN_.js";import"./ArrowForward-tmFPzWCr.js";import"./translation-Bz-XTk2d.js";import"./Page-Bghn-Ugx.js";import"./useMediaQuery-CovhEOX9.js";import"./Divider-BJZ8WmAv.js";import"./ArrowBackIos-CpO9kSrD.js";import"./ArrowForwardIos-CcSLge48.js";import"./translation-UFLIASeG.js";import"./Modal-CcLAGJZ_.js";import"./Portal-CRhyxH_K.js";import"./Backdrop-Bdb7V_oo.js";import"./styled-B5kNIoL_.js";import"./ExpandMore-B4oHnhmj.js";import"./useAsync-BpPAnWcd.js";import"./useMountedState-DMz1NfKI.js";import"./AccordionDetails-Bs2ZQrVE.js";import"./index-B9sM2jn7.js";import"./Collapse-CJL9VCPm.js";import"./ListItem-CR_jODVH.js";import"./ListContext-CCATEDcQ.js";import"./ListItemIcon-3y9dbo5w.js";import"./ListItemText-BFdXXm3F.js";import"./Tabs-DOS4pSuP.js";import"./KeyboardArrowRight-DI4A-BaM.js";import"./FormLabel-BYgi58RV.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BKAjrMSD.js";import"./InputLabel-CVDWFpJN.js";import"./Select-DW4bZF9o.js";import"./Popover-CVFTCziA.js";import"./MenuItem-Dh8H3u5V.js";import"./Checkbox-BEbZEGz9.js";import"./SwitchBase-BXiAu-g5.js";import"./Chip-oiQb7Nr7.js";import"./Link-BchXRwcV.js";import"./lodash-DLuUt6m8.js";import"./useObservable-BMdH8T7u.js";import"./useIsomorphicLayoutEffect-CE2PLaCN.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-qgfWokoB.js";import"./useDebounce-CNquX-17.js";import"./InputAdornment-Buopfie1.js";import"./TextField-3XcAowIe.js";import"./useElementFilter-DGMmV021.js";import"./EmptyState-B6VYzxU9.js";import"./Progress-BkKSeE6q.js";import"./LinearProgress-B1K7cuv1.js";import"./ResponseErrorPanel-5eAEq_h-.js";import"./ErrorPanel-Bjzvo6fH.js";import"./WarningPanel-YDZfKCG0.js";import"./MarkdownContent-DScxBhmk.js";import"./CodeSnippet-QaiBHOZa.js";import"./CopyTextButton-zIe-ESin.js";import"./useCopyToClipboard-GTE9QNgz.js";import"./Tooltip-CxJ8vwKd.js";import"./Popper-Bc6CEfjX.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
