import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-BMBKvx7J.js";import{r as x}from"./plugin-BNuX2paz.js";import{S as l,u as c,a as S}from"./useSearchModal-7bqffBxB.js";import{s as M,M as C}from"./api-CroY5Sq2.js";import{S as f}from"./SearchContext-gT8kWLvH.js";import{B as m}from"./Button-CgZNjnDR.js";import{D as j,a as y,b as B}from"./DialogTitle-DsbJKJA1.js";import{B as D}from"./Box-DyedS4TQ.js";import{S as n}from"./Grid-BeDT5Yac.js";import{S as I}from"./SearchType-CEYwoirC.js";import{L as G}from"./List-BQBKpXrc.js";import{H as R}from"./DefaultResultListItem-O0fs8wZn.js";import{w as k}from"./appWrappers-BOJr_U7C.js";import{SearchBar as v}from"./SearchBar-D8RIoDEC.js";import{S as T}from"./SearchResult-CX1v-lPo.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D6HewuIF.js";import"./Plugin-CijlMu_-.js";import"./componentData-DlTOR1Tf.js";import"./useAnalytics-6fQpVHvB.js";import"./useApp-CHxPlzN3.js";import"./useRouteRef-DhANQE8F.js";import"./index-f5vhF8Nw.js";import"./ArrowForward-C41XCtXB.js";import"./translation-DTbm_qII.js";import"./Page-BiBJNwOJ.js";import"./useMediaQuery-DBlqExsN.js";import"./Divider-ChrZ6SL1.js";import"./ArrowBackIos-C3RGXtGp.js";import"./ArrowForwardIos-1rcHH129.js";import"./translation-BVyhX5-u.js";import"./lodash-Czox7iJy.js";import"./useAsync-Hxi-KY7E.js";import"./useMountedState-BBcU3kFA.js";import"./Modal-CTUzy118.js";import"./Portal-B2w_zRgr.js";import"./Backdrop-B0L6nIyi.js";import"./styled-COJRzbtL.js";import"./ExpandMore-sNERVSEz.js";import"./AccordionDetails-jHFZItW8.js";import"./index-B9sM2jn7.js";import"./Collapse-BfJEIrfz.js";import"./ListItem-CBHuw_mT.js";import"./ListContext-dtOkQmZD.js";import"./ListItemIcon-CXGax7TA.js";import"./ListItemText-DxMoHBvJ.js";import"./Tabs-Cqthr7Ah.js";import"./KeyboardArrowRight-CENeANSn.js";import"./FormLabel-DygA_rlS.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CX6plQnP.js";import"./InputLabel-COEXYWph.js";import"./Select-CMXP9mAd.js";import"./Popover-CGJTysWx.js";import"./MenuItem-CrASxLjG.js";import"./Checkbox-B1wd9zRc.js";import"./SwitchBase-DvVAWUd2.js";import"./Chip-C-NtrCkX.js";import"./Link-CAECYSd6.js";import"./useObservable-B1dXj24X.js";import"./useIsomorphicLayoutEffect-CtcAey4z.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-1a4DFK72.js";import"./useDebounce-dkgIi_gk.js";import"./InputAdornment-C97HP-YS.js";import"./TextField-JQV3OmLT.js";import"./useElementFilter-B6EqugX_.js";import"./EmptyState-DjbqbQVk.js";import"./Progress-CTNnXBFs.js";import"./LinearProgress-8Y-UxlEc.js";import"./ResponseErrorPanel-PSlyhPzG.js";import"./ErrorPanel-D5Anj456.js";import"./WarningPanel-BEJQshL2.js";import"./MarkdownContent-DooLYWBv.js";import"./CodeSnippet-WffvFiX0.js";import"./CopyTextButton-BXHrVG_E.js";import"./useCopyToClipboard-DCvnibP8.js";import"./Tooltip-DXXVKXwk.js";import"./Popper-BvJ_4JLG.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
